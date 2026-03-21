import { Shield, Lock, Eye, FileText, Globe, Zap, Users, LucideIcon, ShieldCheck, ShieldAlert, Bug, Trash2, MailWarning, SearchCode, Mail, Megaphone, KeyRound, Server, HardDrive, Activity, Fingerprint, Filter, Scale, BookOpen } from 'lucide-react';

export interface LegalSection {
  subtitulo: string;
  contenido: string;
  links?: { texto: string; url: string }[];
  icon?: LucideIcon;
}

export interface LegalPageData {
  titulo: string;
  icon: LucideIcon;
  descripcion: string;
  secciones: LegalSection[];
  isSpeedTest?: boolean;
}

export const legalContent: Record<string, LegalPageData> = {
  'control-parental': {
    titulo: 'Control Parental',
    icon: Shield,
    descripcion: 'Herramientas y consejos para proteger a los más pequeños en la red.',
    secciones: [
      {
        subtitulo: 'Nuestro Compromiso',
        contenido: 'En RAPILINK SAS, la seguridad de tus hijos es nuestra prioridad. Brindamos información y herramientas para que los menores naveguen de forma segura y responsable.'
      },
      {
        subtitulo: 'Seguridad a nivel del CPE',
        contenido: 'Nuestros equipos de conexión final cuentan con protocolos de autenticación que garantizan una conexión base segura desde el hogar.'
      },
      {
        subtitulo: 'Recomendaciones',
        contenido: 'Sugerimos el uso de herramientas especializadas para el filtrado de contenidos. Puedes encontrar opciones gratuitas y premium en los siguientes enlaces:',
        links: [
          { texto: 'Top 10 Herramientas Gratuitas', url: 'https://www.rapilinksas.co/top-10-gratuitas-control-parental.html' },
          { texto: 'Top 10 Herramientas de Pago', url: 'https://www.rapilinksas.co/top-10-pago-control-parental.html' }
        ]
      }
    ]
  },
  'explotacion-infantil': {
    titulo: 'Prevención Explotación Infantil',
    icon: Users,
    descripcion: 'Compromiso total con la protección de menores y cumplimiento de la Ley 679 de 2001.',
    secciones: [
      {
        subtitulo: 'Compromiso Corporativo y Marco Legal',
        icon: ShieldCheck,
        contenido: 'RAPILINK SAS lucha contra el maltrato infantil. Por esto se une a la ley 679 expedida por el Congreso de la República el 3 de agosto de 2001, para prevenir y contrarrestar la explotación, la pornografía y el turismo sexual con menores de edad.\n\nPor mandato de la Ley 679 de 2001, todas las personas deben prevenir, bloquear, combatir y denunciar la explotación, alojamiento, uso, publicitación, difusión de imágenes, textos, documentos, archivos audiovisuales, uso indebido de redes globales de información, o el establecimiento de vínculos telemáticos de cualquier clase relacionados con material pornográfico o alusivo a actividades sexuales de menores de edad, por cuanto podría generar responsabilidad de tipo penal.'
      },
      {
        subtitulo: 'Fundamentación Constitucional',
        icon: BookOpen,
        contenido: 'Esta ley se expidió con base en el artículo 44 de la Constitución Política y su objetivo primordial es proteger a los niños de la explotación y el abuso sexual y velar por que tengan un desarrollo sano e integral. Las empresas vinculadas a la Cámara Colombiana de Informática y Telecomunicaciones CCIT y al NAP Colombia nos unimos a la campaña organizada por el Gobierno Nacional contra la pornografía infantil.'
      },
      {
        subtitulo: 'Legislación Aplicable',
        icon: Scale,
        contenido: 'RAPILINK SAS cumple con el marco regulatorio vigente para la protección de niños, niñas y adolescentes:\n\n• Ley 679 de 2001: Prevenir y contrarrestar la explotación, la pornografía y el turismo sexual con menores.\n• Ley 1336 de 2009: Robustecimiento de la lucha contra la explotación y el turismo sexual con menores mediante multas y cierres de establecimientos.\n• Decreto 1524 de 2002: Establece que los niños serán protegidos contra toda forma de abandono, violencia física o moral, secuestro y explotación económica.'
      },
      {
        subtitulo: 'DENUNCIE: Canales Oficiales',
        icon: Megaphone,
        contenido: 'En los siguientes lugares de Internet podrá realizar denuncias relacionadas con sitios y contenidos de pornografía de menores y páginas en las que se ofrezcan servicios ilegales:',
        links: [
          { texto: 'FISCALÍA (Línea 01 800 0912280)', url: 'https://www.fiscalia.gov.co' },
          { texto: 'MINTIC (Línea 01 800 0912667)', url: 'https://www.enticconfio.gov.co' },
          { texto: 'DIJIN (Policía Nacional - Ext. 6301)', url: 'https://www.policia.gov.co/dijin' },
          { texto: 'ICBF (Línea 01 8000 918080)', url: 'https://www.icbf.gov.co' },
          { texto: 'PERSONERÍA DE BOGOTÁ (Línea 143)', url: 'https://www.personeriabogota.gov.co/' },
          { texto: 'CAI VIRTUAL (Línea 112)', url: 'https://caivirtual.policia.gov.co/' }
        ]
      }
    ]
  },
  'politica-cookies': {
    titulo: 'Política de Cookies',
    icon: FileText,
    descripcion: 'Información detallada sobre el uso de cookies en nuestro portal para mejorar tu experiencia.',
    secciones: [
      {
        subtitulo: '¿Qué son las cookies?',
        contenido: 'Una cookie es un pequeño fichero de letras y cifras que se almacena en el navegador del usuario al acceder al portal. En RAPILINK SAS utilizamos tecnologías similares que permiten almacenar y recuperar datos en su dispositivo (como Local Shared Objects o Web Beacons) para mejorar su navegación.\n\nContamos con cookies de "sesión", que se eliminan al cerrar el navegador, y cookies "persistentes", que permanecen en su equipo por un tiempo definido.'
      },
      {
        subtitulo: 'Tipología y Finalidad',
        contenido: 'Utilizamos los siguientes tipos de cookies:\n\n1. Cookies Técnicas: Esenciales para el control del tráfico, comunicación de datos, identificación de sesiones y seguridad durante la navegación. Sin ellas, el sitio no funcionaría correctamente.\n\n2. Cookies Funcionales: Permiten recordar opciones del usuario como el idioma, configuración regional y el navegador desde el que accede, personalizando su experiencia.\n\n3. Cookies de Terceros: Utilizamos Google Analytics para recopilar información estadística anónima sobre el número de visitantes y contenidos más vistos, con el fin de mejorar la efectividad de nuestro portal.'
      },
      {
        subtitulo: 'Revocación y Desactivación',
        contenido: 'Usted puede revocar en cualquier momento el consentimiento para el uso de cookies desactivándolas o borrándolas a través de las opciones de privacidad y seguridad de su navegador. Tenga en cuenta que si desactiva las cookies, algunas funciones del sitio web podrían no estar disponibles o no funcionar de forma óptima.\n\nPuedes gestionar las cookies en la configuración de tu navegador:',
        links: [
          { texto: 'Configurar en Google Chrome', url: 'https://support.google.com/chrome/answer/95647?hl=es' },
          { texto: 'Configurar en Microsoft Edge', url: 'https://support.microsoft.com/es-es/windows/administrar-cookies-en-microsoft-edge-ver-permitir-bloquear-eliminar-y-usar-168dab11-0753-043d-7c16-ede5947fc64d' },
          { texto: 'Configurar en Mozilla Firefox', url: 'https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias' },
          { texto: 'Configurar en Apple Safari', url: 'https://support.apple.com/es-es/105082' }
        ]
      }
    ]
  },
  'aviso-privacidad': {
    titulo: 'Aviso de Privacidad',
    icon: Eye,
    descripcion: 'Transparencia total sobre el tratamiento de tus datos personales conforme a la Ley 1581 de 2012.',
    secciones: [
      {
        subtitulo: 'Responsabilidad del Tratamiento',
        contenido: 'RAPILINK SAS informa que, en cumplimiento de la Ley 1581 del 17 de octubre de 2012, los decretos 1377 de 2013 y 886 de 2014 y demás normas concordantes, somos responsables del tratamiento de sus datos personales.'
      },
      {
        subtitulo: 'Autorización y Finalidades',
        contenido: 'RAPILINK SAS solicita autorización para recolectar, utilizar, transferir, transmitir, almacenar, procesar o suprimir datos personales con las siguientes finalidades:\n\n1. Adecuada prestación de los servicios: Comprende el análisis, desarrollo, factibilidad, contratación, instalación y ejecución del servicio. Incluye consumos, mantenimiento de servicios y portales web, atención al cliente, mejoramiento del servicio, personalización del contenido, ofertas, planes comerciales, satisfacción del cliente, análisis de información, creación de bases de datos e indicadores clave de rendimiento, facturación, seguridad y control de calidad.\n\n2. Fines Comerciales: Comprende la formulación de ofertas, promociones, productos, publicidad, oportunidades, sorteos, campañas, programas de lealtad, fidelización y retención de clientes.\n\n3. Fines legales: Comprende todo tratamiento justificado en el cumplimiento de los requisitos legales aplicables, tales como atención de requerimientos de autoridades gubernamentales, administrativas o judiciales, protección de derechos, propiedad o seguridad de RAPILINK SAS y el público en general.'
      },
      {
        subtitulo: 'Nuevas Finalidades',
        contenido: 'RAPILINK SAS podrá establecer otras finalidades para el tratamiento de datos personales, y para ello, deberá contar con la autorización previa, expresa, consentida e informada del titular para su correspondiente tratamiento.'
      },
      {
        subtitulo: 'Derechos y Canales de Atención',
        contenido: 'El titular de la información tiene derecho a conocer, actualizar y rectificar sus datos personales y, cuando sea procedente, suprimirlos o revocar la autorización otorgada para su tratamiento.\n\nPara presentar una consulta, reclamo o petición, puede utilizar nuestros canales oficiales:\n\n- Portal Web: www.rapilinksas.co\n- Línea de atención: (605) 396 6080 – 300 912 1245\n- WhatsApp: +57 300 825 5091\n- Correo: info.rapilinksas@gmail.com',
        links: [
          { texto: 'Ir al Portal de Clientes', url: 'https://www.rapilinksas.co/' },
          { texto: 'Política Integral de Datos', url: '/legal/datos-personales' }
        ]
      }
    ]
  },
  'datos-personales': {
    titulo: 'Política de Protección de Datos Personales',
    icon: ShieldCheck,
    descripcion: 'RAPILINK SAS garantiza el derecho fundamental al Habeas Data conforme a la Ley 1581 de 2012.',
    secciones: [
      {
        subtitulo: 'Marco Legal y Alcance',
        contenido: 'Para dar cumplimiento a la Ley Estatutaria 1581 del 17 de octubre de 2012, y demás normas que la modifiquen, adicionen, complementen o reglamenten, RAPILINK SAS tiene diferentes procesos y lineamientos para el manejo de información de clientes actuales y potenciales, proveedores, colaboradores y de otros grupos de interés, a los cuales se hace referencia en esta política.'
      },
      {
        subtitulo: 'Finalidades del Tratamiento',
        contenido: 'RAPILINK SAS puede recolectar, utilizar, transferir, transmitir, almacenar, procesar o suprimir datos personales con las siguientes finalidades:\n\n1. Adecuada prestación de los servicios: comprende toda actividad dirigida a analizar y desarrollar la factibilidad, contratación, instalación y ejecución del servicio, determinación de consumos, atención al cliente, facturación, seguridad y control de calidad.\n\n2. Fines Comerciales: comprende toda actividad encaminada a presentar ofertas, promociones, anuncios, publicidad, campañas de fidelización y programas de lealtad.\n\n3. Relacionamiento con públicos de interés: manejo de las relaciones con accionistas, autoridades y comunidad en desarrollo de la gestión empresarial.\n\n4. Fines legales: cumplimiento de requisitos legales aplicables, atender requerimientos de entidades públicas o autoridades judiciales, y proteger los derechos, propiedad o seguridad de Rapilink SAS.'
      },
      {
        subtitulo: 'Tratamiento de Datos de Clientes',
        contenido: 'RAPILINK SAS informará a sus clientes acerca del tratamiento de sus datos y obtendrá previamente su autorización. Los datos se obtienen cuando son proporcionados directamente en canales presenciales o digitales, suscripción a portales, cookies o contacto vía correo o teléfono.\n\nRespecto a las Cookies: pequeñas cifras almacenadas en el navegador para mejorar la experiencia, obtener estadísticas y ofrecer publicidad adaptada. El cliente puede deshabilitarlas en la configuración de su navegador, aunque esto puede afectar el funcionamiento óptimo del portal.'
      },
      {
        subtitulo: 'Transferencia a Terceros',
        contenido: 'De conformidad con la normativa vigente, RAPILINK SAS podrá transferir los datos de los clientes a terceros proveedores o entidades afiliadas en caso de una fusión, adquisición o transición del servicio, siempre contando con la autorización del titular o por orden escrita de autoridad judicial competente.'
      },
      {
        subtitulo: 'Proveedores y Colaboradores',
        contenido: 'Proveedores: Su información se utiliza para ingreso en base de datos, pago de obligaciones contractuales, reportes gubernamentales y procesos de auditoría.\n\nColaboradores: RAPILINK SAS posee datos para materializar obligaciones laborales como identificación, exámenes de vinculación, salario, fondos de pensión, riesgos profesionales y cuenta bancaria para pagos.'
      },
      {
        subtitulo: 'Derechos de los Titulares',
        contenido: 'Los titulares tienen derecho a:\n\n- Conocer, actualizar y rectificar sus datos.\n- Solicitar prueba de la autorización otorgada.\n- Ser informado sobre el uso de sus datos.\n- Revocar la autorización y/o solicitar la supresión de datos.\n- Acceder de forma gratuita a sus datos personales.\n- Presentar quejas ante la Superintendencia de Industria y Comercio por violaciones a las normas de protección de datos.'
      }
    ]
  },
  'neutralidad-red': {
    titulo: 'Neutralidad en la Red',
    icon: Globe,
    descripcion: 'Garantizamos un internet libre, transparente y sin discriminación de contenidos.',
    secciones: [
      {
        subtitulo: 'Libre Acceso y No Bloqueo',
        contenido: 'RAPILINK SAS no realiza bloqueos de contenidos, salvo aquellos que por disposición legal se deban realizar (específicamente contenido de Pornografía Infantil con base en la Ley 679 de 2001), sin el consentimiento expreso del usuario.\n\nGarantizamos que nuestros usuarios puedan acceder a cualquier contenido, aplicación o servicio legal disponible en internet sin restricciones injustificadas.'
      },
      {
        subtitulo: 'Gestión de Tráfico Responsable',
        contenido: 'RAPILINK SAS implementa medidas de gestión de tráfico que son razonables y no discriminatorias respecto de algún proveedor, servicio, contenido o protocolo específico. Estas medidas se aplican únicamente para garantizar la calidad del servicio y la estabilidad de la red para todos nuestros usuarios.'
      },
      {
        subtitulo: 'No Discriminación',
        contenido: 'RAPILINK SAS no realiza limitaciones al acceso, ni lleva a cabo conductas de priorización, degradación o bloqueo respecto de algún proveedor, servicio, contenido o protocolo específico. Aseguramos que el tráfico sea tratado de manera equitativa e igualitaria.'
      }
    ]
  },
  'seguridad-red': {
    titulo: 'Seguridad en la Red',
    icon: Shield,
    descripcion: 'Manual exhaustivo de amenazas y protocolos de seguridad para una navegación confiable.',
    secciones: [
      {
        subtitulo: 'Malware',
        icon: ShieldAlert,
        contenido: 'Es un término general que se utiliza para referirse a distintas formas de software hostil, intrusivo o molesto. El software malintencionado o malware es un software creado por hackers para perturbar las operaciones de una computadora, obtener información confidencial o acceder a sistemas informáticos privados.\n\nEl malware incluye virus informáticos, gusanos, troyanos, spyware, adware, la mayoría de rootkits y otros programas malintencionados.'
      },
      {
        subtitulo: 'Spyware (Software Espía)',
        icon: Bug,
        contenido: 'Es un tipo de malware que se desarrolla e instala en las computadoras para obtener información sobre los usuarios sin que éstos lo sepan. El spyware suele estar oculto al usuario y puede ser difícil de detectar.\n\nAlgunos spywares, como los keyloggers (registradores de teclas), pueden ser instalados de forma intencionada para controlar a los usuarios. Sus funciones van mucho más allá de espiar; pueden llegar hasta la obtención de casi cualquier tipo de datos, incluida información personal como hábitos de navegación en Internet, accesos de usuarios o datos de crédito y cuentas bancarias.\n\nAdemás, puede interferir con el control de una computadora instalando nuevo software o redirigiendo a los navegadores web. Algunos tienen capacidad para modificar la configuración de una computadora, lo que genera menor velocidad de conexión a Internet y cambios no autorizados en navegadores.'
      },
      {
        subtitulo: 'Spam',
        icon: Trash2,
        contenido: 'Consiste en el uso de sistemas de mensajes electrónicos para enviar de forma indiscriminada un gran número de mensajes no solicitados. Aunque la forma más conocida es el de correo electrónico, el término se aplica también a abusos en mensajes instantáneos, grupos de noticias, motores de búsqueda, blogs, wikis, anuncios clasificados, teléfonos móviles, foros de Internet, transmisiones fraudulentas por fax y redes sociales.'
      },
      {
        subtitulo: 'Phishing (Suplantación de Identidad)',
        icon: MailWarning,
        contenido: 'Consiste en el intento de adquirir información confidencial y dinero haciéndose pasar por una entidad de confianza en una comunicación electrónica. Los correos electrónicos de phishing suelen contener enlaces a páginas web infectadas con malware. \n\nUtilizan mensajes instantáneos o correos fraudulentos en los que se pide a los usuarios que introduzcan sus datos en una página web falsa idéntica a la auténtica. Es un ejemplo de técnicas de ingeniería social empleadas para engañar a los usuarios.'
      },
      {
        subtitulo: 'Pharming',
        icon: Globe,
        contenido: 'Es una forma de ataque cuyo objetivo es redireccionar el tráfico de un sitio web legítimo hacia una página fraudulenta. Pretende obtener datos de acceso, como nombres de usuarios y contraseñas. Tanto el pharming como el phishing se utilizan para el robo de identidades online, siendo un problema grave para las empresas de comercio electrónico y banca electrónica.'
      },
      {
        subtitulo: 'Control de Virus y Recomendaciones de Navegación',
        icon: ShieldCheck,
        contenido: '• Mantenga siempre un antivirus actualizado y ejecútelo periódicamente.\n• Use herramientas anti-spyware y bloqueadores de ventanas emergentes (pop-up).\n• Evite visitar páginas no confiables o instalar software de dudosa procedencia. Las aplicaciones peer-to-peer suelen contener programas espías ocultos.\n• Asegúrese de aplicar las actualizaciones de sistemas operativos y navegadores web regularmente.\n• Si no requiere funciones como Java support, ActiveX o Multimedia Autoplay, deshabilítelas.\n• Configure un firewall personal para reducir el riesgo de exposición.'
      },
      {
        subtitulo: 'Seguridad en Correo Electrónico',
        icon: Mail,
        contenido: '1. No publique su cuenta de correo en sitios no confiables.\n2. No preste su cuenta de correo, ya que cualquier acción será su responsabilidad.\n3. No divulgue información confidencial o personal a través del correo.\n4. No conteste correos con advertencias sobre su cuenta bancaria.\n5. Nunca responda a un correo en formato HTML con formularios embebidos.\n6. Si sospecha que ingresó su clave en un sitio no confiable, cámbiela de forma inmediata.'
      },
      {
        subtitulo: 'Control de Spam, Hoax e Ingeniería Social',
        icon: Megaphone,
        contenido: '• Nunca haga clic en enlaces dentro del correo, aun si parecen legítimos. Digite directamente la URL del sitio en una nueva ventana del navegador.\n• Revise el certificado SSL para los sitios que indican ser seguros.\n• No reenvíe correos tipo "cadena" para evitar congestiones y el robo de información en los encabezados.\n• No hable con personas extrañas de asuntos laborales o personales que puedan comprometer información confidencial propia o de terceros.'
      },
      {
        subtitulo: 'Prevención contra el Robo de Contraseñas',
        icon: KeyRound,
        contenido: '• Cambie sus contraseñas frecuentemente, mínimo cada 30 días.\n• Use contraseñas fuertes: fáciles de recordar pero difíciles de adivinar.\n• Longitud mínima recomendada: 10 caracteres, combinada con números y caracteres especiales.\n• Nunca envíe información de claves a través de correos u otros medios no cifrados.'
      },
      {
        subtitulo: 'Mecanismos de Infraestructura RAPILINK SAS',
        icon: Server,
        contenido: 'Contamos con sistemas de autenticación y autorización para controlar el acceso a los servicios de la red:\n\n• Firewall Perimetral: Realiza la primera protección perimetral en nuestras redes y las de nuestros clientes, reduciendo el nivel de impacto ante riesgos de seguridad.\n\n• Protección Antivirus y Antispam: Servidores internos protegidos contra códigos maliciosos y correos basura hacia los clientes.\n\n• Filtrado de URLs: Bloqueamos formalmente sitios con contenido de pornografía infantil (Ley 679 de 2001) denegando acceso a textos o archivos audiovisuales ilícitos.\n\n• Seguridad CPE: Los dispositivos de conexión final en el hogar cuentan con elementos base para una conexión segura.'
      },
      {
        subtitulo: 'Monitorización y Garantía de Red',
        icon: Activity,
        contenido: 'RAPILINK SAS mantiene monitoreo constante de los elementos técnicos de red: \n\n1. Estado de los equipos.\n2. Logs de actividades de infraestructura.\n3. Comportamiento del tráfico en nodos e interconexiones.\n4. Análisis de vulnerabilidades técnico-periódicas.\n5. Respaldo (Backups) de dispositivos protegidos bajo redes de baja exposición.'
      },
      {
        subtitulo: 'Modelos de Seguridad (Estándares UIT)',
        icon: Fingerprint,
        contenido: 'Implementamos modelos de seguridad específicos conforme a las normas internacionales UIT X.805, X.811, X.810 y X.812:\n\n• Autenticación Descentralizada: Verifica identidades de personas y servicios, garantizando el acceso individual con privilegios definidos y evitando riesgos masivos.\n\n• Control de Acceso: Medidas físicas (vigilancia 24/7 en Data Centers con autenticación múltiple) y lógicas (acceso a enrutamiento mediante protocolos seguros como SSH o Kerberos).\n\n• Disponibilidad y TIER: Infraestructuras redundantes que aseguran la continuidad del servicio ante fallos técnicos, bajo estándares de alta disponibilidad.'
      }
    ]
  },
  'test-velocidad': {
    titulo: 'Test de Velocidad',
    icon: Zap,
    descripcion: 'Mide la potencia de tu conexión de fibra óptica.',
    secciones: [
      {
        subtitulo: 'Cómo realizar el test',
        contenido: 'Para una medida exacta, conecta tu equipo vía cable y asegúrate de no tener descargas activas durante la prueba.'
      }
    ],
    isSpeedTest: true
  }
};
