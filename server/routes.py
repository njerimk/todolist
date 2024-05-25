from flask import request, jsonify
from app import app, db
from models import Task

@app.route('/tasks', methods=['GET', 'POST'])
def handle_tasks():
    if request.method == 'POST':
        data = request.json
        new_task = Task(id=data['id'], text=data['text'], date=data['date'], selected=data['selected'], checked=data['checked'], is_new=True)
        db.session.add(new_task)
        db.session.commit()

        # After saving, set is_new to False
        new_task.is_new = False
        db.session.commit()
        
        return jsonify({'message': 'Task created'}), 201

    tasks = Task.query.all()
    return jsonify([{'id': task.id, 'text': task.text, 'date': task.date, 'selected': task.selected, 'checked': task.checked, 'is_new': task.is_new} for task in tasks])


@app.route('/tasks/<task_id>', methods=['PATCH'])
def patch_task(task_id):
    data = request.get_json()
    task = Task.query.get(task_id)
    if not task:
        return jsonify({'message': 'Task not found'}), 404
    task.text = data.get('text', task.text)
    task.date = data.get('date', task.date)
    task.selected = data.get('selected', task.selected)
    task.checked = data.get('checked', task.checked)
    task.is_new = data.get('is_new', task.is_new)
    db.session.commit()
    return jsonify({'id': task.id, 'text': task.text, 'date': task.date, 'selected': task.selected, 'checked': task.checked, 'is_new': task.is_new})

@app.route('/tasks/<task_id>', methods=['DELETE'])
def delete_task(task_id):
    task = Task.query.get(task_id)
    if task is None:
        return jsonify({'message': 'Task not found'}), 404

    db.session.delete(task)
    db.session.commit()
    return jsonify({'message': 'Task deleted'})
