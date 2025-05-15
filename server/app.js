/**
 * AI工具集网站服务器应用
 */

const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const morgan = require('morgan');

// 创建Express应用
const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// 静态文件目录
app.use(express.static(path.join(__dirname, '../web')));

// 路由处理

// 首页
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../web/index.html'));
});

// 工具数据API
app.get('/api/tools', (req, res) => {
  try {
    const toolsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/ai_tools.json'), 'utf8'));
    res.json(toolsData);
  } catch (error) {
    console.error('Error reading tools data:', error);
    res.status(500).json({ error: 'Failed to load tools data' });
  }
});

// 分类数据API
app.get('/api/categories', (req, res) => {
  try {
    const categoriesData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/categories.json'), 'utf8'));
    res.json(categoriesData);
  } catch (error) {
    console.error('Error reading categories data:', error);
    res.status(500).json({ error: 'Failed to load categories data' });
  }
});

// 按类别获取工具
app.get('/api/tools/category/:category', (req, res) => {
  try {
    const { category } = req.params;
    const toolsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/ai_tools.json'), 'utf8'));
    
    const filteredTools = toolsData.tools.filter(tool => 
      tool.category.toLowerCase() === category.toLowerCase()
    );
    
    res.json({ tools: filteredTools });
  } catch (error) {
    console.error('Error filtering tools by category:', error);
    res.status(500).json({ error: 'Failed to filter tools' });
  }
});

// 搜索工具
app.get('/api/tools/search', (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    const toolsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/ai_tools.json'), 'utf8'));
    
    const searchResults = toolsData.tools.filter(tool => {
      const searchTerm = q.toLowerCase();
      return (
        tool.name.toLowerCase().includes(searchTerm) ||
        tool.description.toLowerCase().includes(searchTerm) ||
        tool.category.toLowerCase().includes(searchTerm) ||
        tool.features.some(feature => feature.toLowerCase().includes(searchTerm))
      );
    });
    
    res.json({ tools: searchResults });
  } catch (error) {
    console.error('Error searching tools:', error);
    res.status(500).json({ error: 'Failed to search tools' });
  }
});

// 获取单个工具详情
app.get('/api/tools/:id', (req, res) => {
  try {
    const { id } = req.params;
    const toolsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/ai_tools.json'), 'utf8'));
    
    const tool = toolsData.tools.find(tool => tool.name.toLowerCase() === id.toLowerCase());
    
    if (!tool) {
      return res.status(404).json({ error: 'Tool not found' });
    }
    
    res.json(tool);
  } catch (error) {
    console.error('Error getting tool details:', error);
    res.status(500).json({ error: 'Failed to get tool details' });
  }
});

// 提交新工具（示例，实际应用需要添加验证和安全措施）
app.post('/api/tools/submit', (req, res) => {
  try {
    const newTool = req.body;
    
    // 这里应该添加数据验证
    if (!newTool.name || !newTool.category || !newTool.description || !newTool.website) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // 在实际应用中，这里应该将新工具保存到数据库或通知管理员审核
    // 简化示例，仅返回成功消息
    res.json({ 
      success: true, 
      message: '工具提交成功，等待审核',
      tool: newTool
    });
  } catch (error) {
    console.error('Error submitting new tool:', error);
    res.status(500).json({ error: 'Failed to submit new tool' });
  }
});

// 处理SPA应用的路由
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../web/index.html'));
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 