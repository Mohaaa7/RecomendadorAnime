class Usuario:
    def __init__(self, nombre: str, contrasena: str):
        self._nombre = nombre
        self._contrasena = contrasena

    def get_nombre(self):
        return self._nombre 
    
    def set_nombre(self, nombre):
        self._nombre = nombre

    def mostrar_usuario(self):
        print(f"Usuario: {self._nombre}")
