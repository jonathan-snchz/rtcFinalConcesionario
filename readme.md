# Proyecto API Rest  
## Concesionario FullStack

Proyecto final para la escuela **RockTheCode**, donde se desarrolla una aplicación **FullStack** destinada a la gestión interna de un concesionario de vehículos.

La aplicación permite administrar vehículos, clientes y ventas, relacionandolos entre sí, además de contar con una colección de usuarios para el acceso a la plataforma.

El proyecto está desarrollado principalmente con **Node.js, Express y MongoDB** en el backend, y **React** en el frontend. Además se utilizan librerías como **bcrypt** para la seguridad de contraseñas y **Cloudinary** para la gestión de imágenes.

---

## Objetivo del Proyecto

El objetivo del proyecto es aplicar los conocimientos adquiridos durante el curso en un entorno realista, desarrollando una aplicación con entidades relacionadas y una separación clara entre frontend y backend.

La aplicación está orientada a un uso interno, pensada para empleados o administradores de un concesionario que necesiten gestionar inventario, clientes y ventas de forma sencilla y clara.

---

## Arquitectura del Proyecto

### Backend
```
src/
├── api/
│   ├── controllers/        # Lógica de negocio
│   │   ├── cars.js               # Gestión de vehículos
│   │   ├── clients.js            # Gestión de clientes
│   │   ├── sales.js              # Gestión de ventas
│   │   └── users.js              # Gestión de usuarios
│   ├── models/             # Modelos de datos (Mongoose)
│   │   ├── cars.js
│   │   ├── clients.js
│   │   ├── sales.js
│   │   └── users.js
│   ├── routes/             # Rutas de la API
│   │   ├── carRoutes.js
│   │   ├── clientRoutes.js
│   │   ├── saleRoutes.js
│   │   └── userRoutes.js
│   ├── middlewares/        # Middlewares personalizados
│   │   ├── auth.js               # Autenticación
│   │   └── upload.js             # Subida de imágenes
│   └── utils/
│       └── seeds/                # Semillas de datos
│           ├── data/             # Archivos CSV
│           └── seed.js           # Inserción de datos en la BBDD
├── config/
│   └── db.js                     # Conexión a MongoDB
└── index.js
```
### Frontend
```
src/
├── components/ 
│ ├── Cars/ # Gestión de vehículos
│ ├── Clients/ # Gestión de clientes
│ ├── Sales/ # Gestión de ventas
│ ├── Users/ # Gestión de usuarios
│ ├── Alerts/ # Alertas
│ ├── Buttons/ # Botones 
│ ├── FormComponents/ # Componentes para construir los formularios
│ ├── Modal/ # Componente para construir los modales
│ ├── Header/ # Cabecera de navegación
│ ├── Footer/ # Pie de página
│ ├── Home/ # Página de inicio
│ ├── LogIn/ # Login
│ ├── Register/ # Registro
│ ├── NavBar/ # Barra de navegación
│ ├── NotFound/ # Página 404
│ ├── SearchBar/ # Búsqueda
│ ├── SortControls/ # Ordenamiento
│ └── InfoDisplay/ # Tarjetas de información
├── context/ # Context API
│ └── AuthContext.jsx # Gestión de autenticación
├── hooks/ 
│ ├── useApi.js # Comunicación con API
│ └── useSort.js # Ordenamiento de datos
├── utils/ 
│ └── data.js # Normalización de datos
├── App.jsx # Componente raíz
└── main.jsx # Punto de entrada
```
- Single page aplication desarrollada con React
- Navegación mediante React Router
- Componentización clara y reutilizable
- Comunicación con el backend mediante peticiones HTTP

---

## Base de Datos y Seed

La base de datos se genera a partir de archivos CSV.

El proceso de seed incluye:
- Lectura de archivos CSV mediante fs y csv-parser
- Limpieza y normalización de los datos
- Inserción de datos
- Creación de relaciones entre vehículos, clientes y ventas
- Creación de usuarios de prueba con contraseñas hasheadas mediante bcrypt

Colecciones principales:
- Cars
- Clients
- Sales
- Users

---

## Modelos de Datos

### User

{
  name: String,
  email: String,
  password: String,
  createdAt: Date,
  updatedAt: Date
}

### Car

{
  vin: String,
  brand: String,
  model: String,
  type: String,
  year: Number,
  condition: String,
  km: Number,
  price: Number,
  buyedWhen: Date,
  availability: String,
  color: String,
  img: String
}

### Client

{
  id: Number,
  name: String,
  email: String,
  preferences: String
}

### Sale

{
  id: Number,
  car: ObjectId,
  client: ObjectId,
  date: Date,
  payment: String,
  delivery: Date
}

---

## Rutas de la API

### Users

| Método | Ruta | Uso | Auth |
|--------|------|-----|------|
| POST | /users/register | Registrar usuario | No |
| POST | /users/login | Login de usuario | No |
| GET | /users | Listar usuarios | Sí |
| GET | /users/:id | Obtener usuario | Sí |
| DELETE | /users/:id | Eliminar usuario | Sí |

### Cars

| Método | Ruta | Uso | Auth |
|--------|------|-----|------|
| GET | /cars | Listar vehículos | No |
| POST | /cars | Crear vehículo | Sí |
| GET | /cars/:vin | Detalle de vehículo | Sí |
| PUT | /cars/:vin | Actualizar vehículo | Sí |
| DELETE | /cars/:vin | Eliminar vehículo | Sí |

### Clients

| Método | Ruta | Uso | Auth |
|--------|------|-----|------|
| GET | /clients | Listar clientes | Sí |
| GET | /clients/:id | Detalle de cliente | Sí |
| POST | /clients | Crear cliente | Sí |
| DELETE | /clients/:id | Eliminar cliente | Sí |

### Sales

| Método | Ruta | Uso | Auth |
|--------|------|-----|------|
| GET | /sales | Listar ventas | Sí |
| POST | /sales | Crear venta | Sí |
| DELETE | /sales/:id | Eliminar venta | Sí |

---

## Instalación y Configuración

### Backend

1. Acceder a la carpeta del backend
2. Instalar dependencias  
   npm install
3. Configurar el archivo `.env`
4. Ejecutar el seed para poblar la base de datos
   npm run seed
5. Iniciar el servidor  
   npm run dev

### Frontend

1. Acceder a la carpeta del frontend
2. Instalar dependencias  
   npm install
3. Iniciar la aplicación  
   npm run dev

---

## Usuarios de Prueba

En el seed crean usuarios de prueba con las siguientes credenciales:

manuel@concesionario.com / manuel123  
jose@concesionario.com / jose123  
maria@concesionario.com / maria123  

---

## Tecnologías Utilizadas

### Backend
- **Node.js** - Entorno de ejecución
- **Express** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación por tokens
- **bcrypt** - Encriptación de contraseñas
- **Cloudinary** - Almacenamiento de imágenes
- **Multer** - Manejo de uploads de archivos

### Frontend
- **React** - Biblioteca para interfaces
- **Vite** - Build tool y servidor de desarrollo
- **React Router DOM** - Navegación entre páginas
- **React Hook Form** - Manejo de formularios
- **Context API** - Gestión de estado global

### Desarrollo
- **ESLint** - Linting de código
- **Nodemon** - Recarga automática en desarrollo
- **CORS** - Cross-Origin Resource Sharing

---

## Características del Sistema

### Gestión de Vehículos
- Listado completo con imágenes
- Filtrado por marca, tipo y disponibilidad
- Detalle técnico completo (VIN, año, km, precio)
- Subida de imágenes a Cloudinary
- Estados: disponible, vendido, reservado

### Gestión de Clientes
- Registro con ID único
- Historial de preferencias
- Vinculación con ventas realizadas

### Sistema de Ventas
- Registro de transacciones
- Vinculación automática con vehículos y clientes
- Cambio automático de estado del vehículo
- Métodos de pago: efectivo, transferencia, financiación
- Control de fechas de venta y entrega

### Autenticación y Seguridad
- Login con JWT tokens
- Rutas protegidas por autenticación
- Passwords encriptados con bcrypt

### Interfaz de Usuario
- Diseño responsive
- Componentes reutilizables
- Feedback visual con alertas
- Búsqueda y orden de listas

---

## Consideraciones de Seguridad

1. **Autenticación JWT** - Tokens firmados con secreto
2. **Contraseñas hasheadas** - Encriptación con bcrypt
3. **Protección de rutas** - Middleware de autenticación

---