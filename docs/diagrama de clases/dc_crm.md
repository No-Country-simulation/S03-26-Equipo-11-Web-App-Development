classDiagram
    class Usuario {
        +int id
        +string nombre
        +string email
        +string password
        +string rol
        +datetime ultimo_acceso
        +boolean activo
        +login()
        +logout()
        +actualizarPerfil()
    }

    class Contacto {
        +int id
        +string nombre
        +string email
        +string telefono
        +string empresa
        +string cargo
        +string tipo_usuario
        +string estado_funnel
        +datetime fecha_creacion
        +datetime ultimo_contacto
        +string fuente
        +crearContacto()
        +actualizarEstado()
        +asignarEtiqueta()
    }

    class Etiqueta {
        +int id
        +string nombre
        +string color
        +string descripcion
        +crearEtiqueta()
        +actualizarEtiqueta()
    }

    class Conversacion {
        +int id
        +string canal
        +datetime fecha_inicio
        +datetime ultimo_mensaje
        +string estado
        +int contactoid
        +iniciarConversacion()
        +archivarConversacion()
        +obtenerHistorial()
    }

    class Mensaje {
        +int id
        +string contenido
        +string tipo
        +datetime fecha_envio
        +boolean leido
        +string direccion
        +enviarMensaje()
        +marcarComoLeido()
    }

    class Email {
        +int id
        +string asunto
        +string cuerpo
        +string plantilla_id
        +list adjuntos
        +datetime programado_para
        +string estado_envio
        +enviarEmail()
        +programarEnvio()
    }

    class PlantillaEmail {
        +int id
        +string nombre
        +string asunto
        +string cuerpo_html
        +string cuerpo_texto
        +list variables
        +crearPlantilla()
        +previsualizar()
    }

    class Tarea {
        +int id
        +string titulo
        +string descripcion
        +datetime fecha_limite
        +string prioridad
        +string estado
        +int usuarioid
        +crearTarea()
        +completarTarea()
        +recordatorio()
    }

    class Recordatorio {
        +int id
        +datetime fecha_recordatorio
        +string tipo
        +boolean enviado
        +programarRecordatorio()
        +enviarNotificacion()
    }

    class FunnelEtapa {
        +int id
        +string nombre
        +int orden
        +string color
        +boolean activo
        +moverContacto()
    }

    class Metricas {
        +int id
        +datetime fecha
        +int contactos_nuevos
        +int mensajes_enviados
        +int emails_abiertos
        +float tasa_respuesta
        +generarReporte()
        +exportarPDF()
        +exportarCSV()
    }

    class VistasGuardadas {
        +int id
        +string nombre
        +json filtros
        +int usuarioid
        +boolean predeterminada
        +guardarVista()
        +aplicarFiltros()
    }

    Usuario "1" -- "*" Tarea : asigna
    Contacto "1" -- "*" Conversacion : tiene
    Contacto "*" -- "*" Etiqueta : etiquetado
    Conversacion "1" -- "*" Mensaje : contiene
    Contacto "1" -- "*" Email : recibe
    PlantillaEmail "1" -- "*" Email : usa
    Tarea "1" -- "0..1" Recordatorio : tiene
    Contacto "1" -- "*" ContactoHistorial : registra
    FunnelEtapa "1" -- "*" Contacto : clasifica
    Usuario "1" -- "*" VistasGuardadas : crea

    