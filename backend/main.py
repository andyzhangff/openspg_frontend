from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import uvicorn
import httpx
import json
import os
from datetime import datetime
from dotenv import load_dotenv

# 加载 .env 文件
load_dotenv()

app = FastAPI(title="OpenSPG Schema 画板后端")

# 添加 CORS 中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 环境变量配置 - 云端 LLM
LLM_API_BASE_URL = os.getenv("LLM_API_BASE_URL", "https://api.openai.com/v1")
LLM_API_KEY = os.getenv("LLM_API_KEY", "")
LLM_MODEL = os.getenv("LLM_MODEL", "gpt-4o-mini")

# 1. 定义 React Flow 兼容的数据模型
class NodeData(BaseModel):
    label: str
    category: str  # EntityType, ConceptType, Relation, EventType
    props: List[str] = []

class ReactFlowNode(BaseModel):
    id: str
    type: str = "cyberNode"
    data: NodeData
    position: Dict[str, int]

class ReactFlowEdge(BaseModel):
    id: str
    source: str
    target: str
    label: str
    animated: bool = True
    type: str = "cyberEdge"

class SchemaDraft(BaseModel):
    nodes: List[ReactFlowNode]
    edges: List[ReactFlowEdge]

class ExtractRequest(BaseModel):
    text: str

# 2. System Prompt
SYSTEM_PROMPT = """Role: 你是顶级知识图谱架构师，专门负责将业务文本转化为 OpenSPG 标准的 Schema 定义。

Task: 从用户输入的文本中，识别并提取以下四种元素，并生成符合 React Flow 格式的 JSON。

Element Definitions:
- EntityType: 客观存在的独立对象（如：供应商、采购单）。必须包含 ID 和 核心属性。
- ConceptType: 抽象的分类或标签（如：信用等级、采购类型）。用于分类和逻辑推理。
- Relation: 连接两个节点（实体-实体，或实体-概念）的边。必须明确方向和语义谓词（如：supplies, INDEX_OF）。
- EventType: 动态业务动作。必须包含时间、主体、对象三要素。

Output Constraint:
- 仅返回 JSON 格式。
- 为每个节点分配初始坐标，确保布局美观，不重叠。
- 风格对齐"赛博边缘"：节点类型标记为 cyberNode，连线标记为 cyberEdge。

JSON Template:
{
  "nodes": [
    { 
      "id": "e1", 
      "type": "cyberNode", 
      "data": { 
        "label": "供应商", 
        "category": "EntityType", 
        "props": ["名称", "状态"] 
      }, 
      "position": { "x": 100, "y": 100 } 
    }
  ],
  "edges": [
    { 
      "id": "l1", 
      "source": "e1", 
      "target": "c1", 
      "label": "拥有等级", 
      "animated": true 
    }
  ]
}"""

# 3. LLM 调用函数
async def call_llm(prompt: str) -> str:
    """
    调用云端 LLM API（OpenAI 格式）
    """
    if not LLM_API_KEY:
        raise HTTPException(status_code=500, detail="LLM_API_KEY 环境变量未设置")
    
    try:
        headers = {
            "Authorization": f"Bearer {LLM_API_KEY}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": LLM_MODEL,
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.7,
            "top_p": 0.9,
            "max_tokens": 2000
        }
        
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                f"{LLM_API_BASE_URL}/chat/completions",
                headers=headers,
                json=payload
            )
            response.raise_for_status()
            result = response.json()
            
            # 提取响应内容
            content = result.get("choices", [{}])[0].get("message", {}).get("content", "")
            return content
            
    except httpx.HTTPError as e:
        print(f"LLM 调用错误: {e}")
        raise HTTPException(status_code=500, detail=f"LLM 服务调用失败: {str(e)}")
    except Exception as e:
        print(f"未知错误: {e}")
        raise HTTPException(status_code=500, detail=f"处理请求时发生错误: {str(e)}")

# 4. 提取 Schema 的核心函数
async def extractSchema(text: str) -> SchemaDraft:
    """
    从用户输入的文本中提取 Schema 结构
    """
    if not text or not text.strip():
        raise HTTPException(status_code=400, detail="输入文本不能为空")
    
    # 构建用户提示词
    user_prompt = f"用户输入: {text}\n\n请根据上述要求，提取并返回 JSON 格式的 Schema:"
    
    # 调用 LLM
    llm_response = await call_llm(user_prompt)
    
    # 解析 LLM 返回的 JSON
    try:
        # 尝试提取 JSON 部分（LLM 可能会在 JSON 前后添加额外文本）
        json_start = llm_response.find("{")
        json_end = llm_response.rfind("}") + 1
        
        if json_start == -1 or json_end == 0:
            raise ValueError("未找到有效的 JSON 格式")
        
        json_str = llm_response[json_start:json_end]
        schema_data = json.loads(json_str)
        
        # 验证并转换为 SchemaDraft
        nodes = []
        edges = []
        
        # 处理节点
        for i, node_data in enumerate(schema_data.get("nodes", [])):
            node = ReactFlowNode(
                id=node_data.get("id", f"node_{i}"),
                type=node_data.get("type", "cyberNode"),
                data=NodeData(
                    label=node_data.get("data", {}).get("label", "Unknown"),
                    category=node_data.get("data", {}).get("category", "EntityType"),
                    props=node_data.get("data", {}).get("props", [])
                ),
                position=node_data.get("position", {"x": 100 + i * 150, "y": 100 + i * 100})
            )
            nodes.append(node)
        
        # 处理边
        for i, edge_data in enumerate(schema_data.get("edges", [])):
            edge = ReactFlowEdge(
                id=edge_data.get("id", f"edge_{i}"),
                source=edge_data.get("source", ""),
                target=edge_data.get("target", ""),
                label=edge_data.get("label", ""),
                animated=edge_data.get("animated", True),
                type=edge_data.get("type", "cyberEdge")
            )
            edges.append(edge)
        
        return SchemaDraft(nodes=nodes, edges=edges)
        
    except json.JSONDecodeError as e:
        print(f"JSON 解析错误: {e}")
        print(f"LLM 响应: {llm_response}")
        raise HTTPException(status_code=500, detail=f"无法解析 LLM 返回的 JSON: {str(e)}")
    except Exception as e:
        print(f"Schema 提取错误: {e}")
        raise HTTPException(status_code=500, detail=f"Schema 提取失败: {str(e)}")

# 5. API 接口
@app.post("/api/extract", response_model=SchemaDraft)
async def extract_schema_endpoint(request: ExtractRequest):
    """
    提取 Schema 的 API 接口
    """
    print(f"[{datetime.now()}] 收到提取请求: {request.text[:100]}...")
    result = await extractSchema(request.text)
    print(f"[{datetime.now()}] 提取完成: {len(result.nodes)} 个节点, {len(result.edges)} 条边")
    
    # 打印详细结果
    print(f"[{datetime.now()}] 返回的 Nodes:")
    for node in result.nodes:
        print(f"  - ID: {node.id}, Label: {node.data.label}, Category: {node.data.category}, Position: {node.position}")
    
    print(f"[{datetime.now()}] 返回的 Edges:")
    for edge in result.edges:
        print(f"  - ID: {edge.id}, Source: {edge.source} -> Target: {edge.target}, Label: {edge.label}")
    
    return result

@app.post("/api/save_to_spg")
async def save_to_spg(draft: SchemaDraft):
    """
    保存 Schema 到 OpenSPG 后端
    """
    print(f"[{datetime.now()}] 正在保存到 OpenSPG 后端...")
    print(f"节点数量: {len(draft.nodes)}")
    print(f"边数量: {len(draft.edges)}")
    
    # 这里编写将修改后的 JSON 发送给 NAS 上 OpenSPG 后端的逻辑
    # 示例：调用 OpenSPG API
    
    return {
        "status": "success",
        "message": "Schema 已同步至 OpenSPG",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/health")
async def health_check():
    """
    健康检查接口
    """
    return {
        "status": "healthy",
        "service": "OpenSPG Schema Backend",
        "timestamp": datetime.now().isoformat()
    }

if __name__ == "__main__":
    print("=" * 50)
    print("OpenSPG Schema 画板后端")
    print("=" * 50)
    print(f"LLM API Base URL: {LLM_API_BASE_URL}")
    print(f"LLM Model: {LLM_MODEL}")
    print(f"LLM API Key: {'已设置' if LLM_API_KEY else '未设置'}")
    print("=" * 50)
    
    uvicorn.run(app, host="0.0.0.0", port=8001)
