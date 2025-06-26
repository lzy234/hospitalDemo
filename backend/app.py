from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import json
import os
from coze_client import CozeClient

app = Flask(__name__)
CORS(app)

# 全局变量存储配置和Coze客户端
config = None
coze_client = None

def load_config():
    """加载配置文件"""
    global config
    # 尝试多个可能的配置文件路径
    possible_paths = [
        # Docker 容器中的路径（如果config目录被复制了）
        '/app/config/app_config.json',
        # 本地开发环境路径
        os.path.join(os.path.dirname(os.path.dirname(__file__)), 'config', 'app_config.json'),
        # 当前目录下的config目录
        os.path.join(os.path.dirname(__file__), '..', 'config', 'app_config.json'),
        # 备用路径
        './config/app_config.json',
        '../config/app_config.json'
    ]
    
    for config_path in possible_paths:
        print(f"尝试加载配置文件: {config_path}")
        try:
            if os.path.exists(config_path):
                with open(config_path, 'r', encoding='utf-8') as f:
                    config = json.load(f)
                print(f"配置文件加载成功: {config_path}")
                return config
            else:
                print(f"配置文件不存在: {config_path}")
        except FileNotFoundError:
            print(f"配置文件未找到: {config_path}")
            continue
        except json.JSONDecodeError as e:
            print(f"配置文件JSON格式错误: {e}")
            continue
        except Exception as e:
            print(f"加载配置文件时发生错误: {e}")
            continue
    
    # 如果所有路径都失败，创建默认配置
    print("所有配置文件路径都失败，使用默认配置")
    config = {
        "ui": {
            "title": "医学手术复盘AI助手",
            "subtitle": "基于AI的手术视频分析与智能问答系统",
            "suggested_questions": [
                "请分析这次手术的关键操作步骤有哪些？",
                "手术过程中有哪些需要改进的地方？",
                "这次手术的整体效果如何，有什么学习要点？"
            ],
            "mock_video_analysis_result": "手术客观数据报告：\n手术术式：腹腔镜左肝切除术\n手术时间：90min\n手术总出血量：100ml\n使用器械：超声刀\n中心静脉压：控制在 0 ～ 30cmH2O\n腹压：适当升高至15 ～ 17mmHg"
        },
        "app": {
            "backend_port": 5000,
            "frontend_port": 3000
        }
    }
    return config

def init_coze_client():
    """初始化Coze客户端"""
    global coze_client
    if config and config.get('coze'):
        try:
            coze_client = CozeClient(config['coze'])
            print("Coze客户端初始化成功")
            return True
        except Exception as e:
            print(f"Coze客户端初始化失败: {e}")
            return False
    print("配置中未找到Coze配置")
    return False

# 在模块级别初始化配置
print("启动后端服务...")
if load_config():
    print("配置文件加载成功")
    # 初始化Coze客户端
    init_coze_client()
else:
    print("配置文件加载失败，使用默认配置")

@app.route('/', methods=['GET'])
def root():
    """根路由"""
    return jsonify({
        'message': 'Hospital Demo Backend API',
        'status': 'running',
        'version': '1.0.0',
        'endpoints': [
            '/health',
            '/api/config',
            '/api/upload/mock',
            '/api/analysis/mock',
            '/api/chat/stream'
        ]
    })

@app.route('/api/config', methods=['GET'])
def get_config():
    """获取前端配置信息"""
    try:
        if not config:
            print("配置文件为空，返回错误")
            return jsonify({'error': '配置文件加载失败'}), 500
        
        # 只返回前端需要的配置，不包含敏感信息
        frontend_config = {
            'ui': config.get('ui', {}),
            'app': {
                'backend_port': config.get('app', {}).get('backend_port', 5000)
            }
        }
        print(f"返回前端配置: {frontend_config}")
        return jsonify(frontend_config)
    except Exception as e:
        print(f"获取配置时发生错误: {e}")
        return jsonify({'error': f'获取配置失败: {str(e)}'}), 500

@app.route('/api/upload/mock', methods=['POST'])
def mock_upload():
    """模拟视频上传接口"""
    try:
        # 模拟上传延迟
        import time
        time.sleep(1)
        
        filename = 'surgery_video.mp4'
        if request.json and request.json.get('filename'):
            filename = request.json.get('filename')
        
        result = {
            'success': True,
            'message': '视频上传成功',
            'filename': filename
        }
        print(f"模拟上传成功: {result}")
        return jsonify(result)
    except Exception as e:
        print(f"模拟上传时发生错误: {e}")
        return jsonify({'error': f'上传失败: {str(e)}'}), 500

@app.route('/api/analysis/mock', methods=['POST'])
def mock_analysis():
    """模拟视频解析接口"""
    try:
        # 模拟解析延迟
        import time
        time.sleep(2)
        
        if not config:
            print("配置文件为空，无法获取模拟分析结果")
            return jsonify({'error': '配置文件加载失败'}), 500
        
        analysis_result = config.get('ui', {}).get('mock_video_analysis_result', '模拟解析结果文本')
        
        result = {
            'success': True,
            'message': '视频解析完成',
            'result': analysis_result
        }
        print(f"模拟分析完成: {result}")
        return jsonify(result)
    except Exception as e:
        print(f"模拟分析时发生错误: {e}")
        return jsonify({'error': f'分析失败: {str(e)}'}), 500

@app.route('/api/chat/stream', methods=['POST'])
def chat_stream():
    """流式聊天接口"""
    if not coze_client:
        return jsonify({'error': 'Coze客户端未初始化'}), 500
    
    data = request.get_json()
    message = data.get('message', '')
    
    if not message:
        return jsonify({'error': '消息不能为空'}), 400
    
    def generate():
        try:
            for chunk in coze_client.chat_stream(message):
                yield f"data: {json.dumps(chunk, ensure_ascii=False)}\n\n"
        except Exception as e:
            error_data = {'error': str(e), 'type': 'error'}
            yield f"data: {json.dumps(error_data, ensure_ascii=False)}\n\n"
        finally:
            # 发送结束标志
            yield f"data: {json.dumps({'type': 'end'}, ensure_ascii=False)}\n\n"
    
    return Response(generate(), mimetype='text/plain')

@app.route('/health', methods=['GET'])
def health_check():
    """健康检查接口"""
    return jsonify({'status': 'healthy', 'message': 'Backend is running'})

if __name__ == '__main__':
    port = config.get('app', {}).get('backend_port', 5000) if config else 5000
    print(f"服务将在端口 {port} 启动")
    app.run(host='0.0.0.0', port=port, debug=True) 