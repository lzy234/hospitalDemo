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
    config_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'config', 'app_config.json')
    try:
        with open(config_path, 'r', encoding='utf-8') as f:
            config = json.load(f)
        return config
    except FileNotFoundError:
        print(f"配置文件未找到: {config_path}")
        return None
    except json.JSONDecodeError:
        print("配置文件JSON格式错误")
        return None

def init_coze_client():
    """初始化Coze客户端"""
    global coze_client
    if config and config.get('coze'):
        coze_client = CozeClient(config['coze'])
        return True
    return False

@app.route('/api/config', methods=['GET'])
def get_config():
    """获取前端配置信息"""
    if not config:
        return jsonify({'error': '配置文件加载失败'}), 500
    
    # 只返回前端需要的配置，不包含敏感信息
    frontend_config = {
        'ui': config.get('ui', {}),
        'app': {
            'backend_port': config.get('app', {}).get('backend_port', 5000)
        }
    }
    return jsonify(frontend_config)

@app.route('/api/upload/mock', methods=['POST'])
def mock_upload():
    """模拟视频上传接口"""
    # 模拟上传延迟
    import time
    time.sleep(1)
    
    return jsonify({
        'success': True,
        'message': '视频上传成功',
        'filename': request.json.get('filename', 'surgery_video.mp4') if request.json else 'surgery_video.mp4'
    })

@app.route('/api/analysis/mock', methods=['POST'])
def mock_analysis():
    """模拟视频解析接口"""
    # 模拟解析延迟
    import time
    time.sleep(2)
    
    if not config:
        return jsonify({'error': '配置文件加载失败'}), 500
    
    analysis_result = config.get('ui', {}).get('mock_video_analysis_result', '模拟解析结果文本')
    
    return jsonify({
        'success': True,
        'message': '视频解析完成',
        'result': analysis_result
    })

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
    # 加载配置
    if load_config():
        print("配置文件加载成功")
        # 初始化Coze客户端
        if init_coze_client():
            print("Coze客户端初始化成功")
        else:
            print("Coze客户端初始化失败")
    else:
        print("配置文件加载失败，使用默认配置")
    
    port = config.get('app', {}).get('backend_port', 5000) if config else 5000
    app.run(host='0.0.0.0', port=port, debug=True) 