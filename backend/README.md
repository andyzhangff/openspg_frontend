# OpenSPG Schema 画板后端

基于 FastAPI 的后端服务，用于从用户输入中提取 Schema 结构并调用 LLM 进行处理。

## 功能特性

- **Schema 提取**：通过 LLM 从用户输入中提取 EntityType、ConceptType、Relation、EventType
- **React Flow 兼容**：返回符合 React Flow 格式的 nodes 和 edges
- **赛博边缘风格**：节点类型为 cyberNode，连线类型为 cyberEdge
- **自动布局**：为节点分配初始坐标，确保布局美观

## 环境要求

- Python 3.8+
- Ollama 服务运行在本地（默认端口 11434）

## 安装依赖

```bash
# 创建虚拟环境（可选）
python -m venv venv

# 激活虚拟环境
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

# 安装依赖
pip install -r requirements.txt
```

## 配置

创建 `.env` 文件：

```bash
cp .env.example .env
```

编辑 `.env` 文件配置 Ollama：

```env
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5:7b
```

## 启动服务

```bash
python main.py
```

服务将在 `http://localhost:8000` 启动。

## API 接口

### 1. 提取 Schema

**POST** `/api/extract`

请求体：
```json
{
  "text": "供应商拥有信用等级，采购单包含供应商信息"
}
```

响应：
```json
{
  "nodes": [
    {
      "id": "e1",
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
}
```

### 2. 保存到 OpenSPG

**POST** `/api/save_to_spg`

请求体：
```json
{
  "nodes": [...],
  "edges": [...]
}
```

响应：
```json
{
  "status": "success",
  "message": "Schema 已同步至 OpenSPG",
  "timestamp": "2024-01-01T00:00:00"
}
```

### 3. 健康检查

**GET** `/api/health`

响应：
```json
{
  "status": "healthy",
  "service": "OpenSPG Schema Backend",
  "timestamp": "2024-01-01T00:00:00"
}
```

## System Prompt

后端使用以下 System Prompt 指导 LLM 提取 Schema：

```
Role: 你是顶级知识图谱架构师，专门负责将业务文本转化为 OpenSPG 标准的 Schema 定义。

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
```

## 开发说明

### 修改 Ollama 模型

在 `.env` 文件中修改 `OLLAMA_MODEL`：

```env
OLLAMA_MODEL=llama3:8b
```

### 调整 LLM 参数

在 `main.py` 的 `call_llm` 函数中修改：

```python
"options": {
    "temperature": 0.7,  # 温度：控制随机性
    "top_p": 0.9,        # Top-p：控制多样性
    "max_tokens": 2000     # 最大输出长度
}
```

## 故障排查

### LLM 连接失败

确保 Ollama 服务正在运行：

```bash
# 检查 Ollama 状态
curl http://localhost:11434/api/tags
```

### JSON 解析错误

如果 LLM 返回的 JSON 格式不正确，检查：
1. LLM 模型是否支持 JSON 输出
2. 是否需要调整 System Prompt
3. 查看 `main.py` 中的错误日志

## 许可证

MIT License
