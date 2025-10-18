from flask import  Flask

app = Flask(__name__)

@app.route('/')
def home():
    return "Hola mundo"

@app.route('/hola')
def about():
    return "Hola"


@app.route('/user/<string:user>')
def user(user):
    return f"Hola, {user}!"

@app.route('/suma/<int:num1>/<int:num2>')
def suma(num1, num2):
    return f"La suma es : {num1+num2}!"

@app.route('/username/<int:id>/<string:username>')
def username(id,username):
    return "ID: {} nombre: {}".format(id,username)

@app.route('/suma/<float:n1>/<float:n2>')
def func(n1, n2):
    return "La suma es : {}".format(n1+n2)

@app.route('/default')
@app.route('/default/<string:dft>')
def func1(dft="sss"):
    return "El valor de dft es:"+dft


if  __name__ == '__main__':
    app.run(debug=True)
