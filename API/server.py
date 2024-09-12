from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# 模拟存储所有用户位置信息的列表
users_positions = []
    # {
    #     "latitude": 23.145857729967963,
    #     "longitude": 113.32596346177941,
    #     "name": "111"
    # },
    # {
    #     "latitude": 23.15585688254556,
    #     "longitude": 113.32608734029658,
    #     "name": "222"
    # },
    # {
    #     "latitude": 23.165855713764762,
    #     "longitude": 113.32602920341634,
    #     "name": "333"
    # }


@app.route('/submit_location', methods=['POST'])
def submit_and_get_positions():  
    # 获取请求中的JSON数据
    user_info = request.get_json()
    # print('recv:',user_info)
    print(users_positions)
    
    if not user_info or 'name' not in user_info or 'latitude' not in user_info or 'longitude' not in user_info:
        return jsonify({"error": "Invalid data format. Expected name, latitude, and longitude."}), 400
    
    # 存储用户的位置信息
        # 检查是否有重复的名字
    for existing_info in users_positions:
        if existing_info.get('name') == user_info['name']:
            return jsonify(users_positions), 200
    
    # 存储用户的位置信息（如果没有重复）
    print('正在插入新数据')
    users_positions.append(user_info)
    
    # 返回除了最新提交的之外的所有位置信息
    # 注意：在实际应用中，您可能需要考虑分页、过滤或从数据库中高效查询
    return jsonify(users_positions), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0',port=8082)