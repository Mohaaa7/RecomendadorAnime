class Usuario:
    def __init__(self, nombre: str, contrasena: str, email: str = None, rol: str = "usuario"):
        self._nombre = nombre
        self._contrasena = contrasena
        self._email = email
        self._rol = rol

    def get_nombre(self):
        return self._nombre 
    
    def set_nombre(self, nombre):
        self._nombre = nombre

    def get_email(self):
        return self._email

    def set_email(self, email):
        self._email = email

    def get_rol(self):
        return self._rol

    def set_rol(self, rol):
        self._rol = rol

    def mostrar_usuario(self):
        print(f"Usuario: {self._nombre}, Email: {self._email}, Rol: {self._rol}")
