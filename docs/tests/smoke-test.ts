/**
 * Comando de ejecución: npx ts-node docs/tests/smoke-test.ts
 * verifica que el servidor esté corriendo antes de ejecutar las pruebas: pnpm run dev
 * asume que se registro cuenta con endpoint POST /api/auth/sign-in/email con email: test@example.com verificar la ejecucion antes de ejecutar las pruebas
 */

export {};

const BASE_URL = "http://localhost:3000";
//const BASE_URL = "https://s02-26-equipo-03-web-app-developmen.vercel.app/";

interface TestCase {
  name: string;
  method: "GET" | "POST";
  endpoint: string;
  body?: any;
  expectedStatus: number;
  requiresAuth: boolean;
  description: string;
}

const ORDERS_PROJECT_PLACEHOLDER = "{{projectId}}";
const ORDERS_PROJECT_ID = "6164b768-9979-4683-a9c2-1565b8fc0000";

const ORDERS_DETAIL_PLACEHOLDER = "{{orderId}}";
const ORDERS_DETAIL_ORDER_ID = "eaba1590-b2f1-4c5b-b44c-ef14a9957914";

const testCases: TestCase[] = [
  {
    name: "1 Health Check",
    method: "GET",
    endpoint: "/api/health",
    expectedStatus: 200,
    requiresAuth: false,
    description: "Verificar que el servidor está activo",
  },
  {
    name: "2 Login FAIL - Credenciales inválidas",
    method: "POST",
    endpoint: "/api/auth/sign-in/email",
    body: {
      email: "wrong@example.com",
      password: "wrongpassword",
    },
    expectedStatus: 401,
    requiresAuth: false,
    description: "Login con credenciales incorrectas",
  },

  {
    name: "3 Analytics orders - Sin sesión",
    method: "GET",
    endpoint: "/api/v1/analytics/orders?projectId=no-session-project",
    expectedStatus: 401,
    requiresAuth: false,
    description: "Acceso sin sesión debe retornar 401",
  },

  {
    name: "4 Login SUCCESS",
    method: "POST",
    endpoint: "/api/auth/sign-in/email",

    body:  {
      "email": "favian@gmail.com",
      "password": "Clave123"
    },
    expectedStatus: 200,
    requiresAuth: false,
    description: "Login con credenciales válidas",
  },
  {
    name: "4.1 Get session",
    method: "GET",
    endpoint: "/api/auth/get-session",
    expectedStatus: 200,
    requiresAuth: true,
    description: "Obtiene userId actual de la sesión para pruebas protegidas",
  },

  {
    name: "5 Analytics orders - con sesión y projectId",
    method: "GET",
    endpoint: `/api/v1/analytics/orders?projectId=${ORDERS_PROJECT_PLACEHOLDER}`,
    expectedStatus: 200,
    requiresAuth: true,
    description: "Debe retornar reporte de órdenes y response.ok true",
  },
  {
    name: "6 Analytics orders detail - con sesión y orderId",
    method: "GET",
    endpoint: `/api/v1/analytics/orders_detail?orderId=${ORDERS_DETAIL_PLACEHOLDER}`,
    expectedStatus: 200,
    requiresAuth: true,
    description: "Debe retornar reporte de órdenes detalle y response.ok true",
  },
  {
    name: "7 Sign Out - CON sesión",
    method: "POST",
    endpoint: "/api/auth/sign-out",
    body: {},
    expectedStatus: 200,
    requiresAuth: true,
    description: "Logout debe cerrar sesión",
  },
];

async function runTests() {
  console.log(" INICIANDO PRUEBAS DE SEGURIDAD Y AUTENTICACIÓN\n");
  console.log("".repeat(80));

  let passed = 0;
  let failed = 0;
  let cookies = "";
  const currentProjectId = ORDERS_PROJECT_ID;
  const currentOrderId = ORDERS_DETAIL_ORDER_ID;

  for (const test of testCases) {
    if (test.requiresAuth && !cookies) {
      console.log(`\n  SALTANDO: "${test.name}" (sin sesión disponible)\n`);
      continue;
    }

    let resolvedEndpoint = test.endpoint;

    if (resolvedEndpoint.includes(ORDERS_PROJECT_PLACEHOLDER)) {
      resolvedEndpoint = resolvedEndpoint.replace(
        ORDERS_PROJECT_PLACEHOLDER,
        encodeURIComponent(currentProjectId)
      );
    }

    if (test.endpoint.includes(ORDERS_PROJECT_PLACEHOLDER) && !currentProjectId) {
      console.log(`\n  SALTANDO: "${test.name}" (projectId no disponible)\n`);
      continue;
    }

    if (resolvedEndpoint.includes(ORDERS_DETAIL_PLACEHOLDER)) {
      resolvedEndpoint = resolvedEndpoint.replace(
        ORDERS_DETAIL_PLACEHOLDER,
        encodeURIComponent(currentOrderId)
      );
    }

    if (test.endpoint.includes(ORDERS_DETAIL_PLACEHOLDER) && !currentOrderId) {
      console.log(`\n  SALTANDO: "${test.name}" (orderId no disponible)\n`);
      continue;
    }    

    const url = `${BASE_URL}${resolvedEndpoint}`;
    const options: RequestInit = {
      method: test.method,
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    };

    if (test.body) {
      options.body = JSON.stringify(test.body);
    }

    if (cookies) {
      options.headers = {
        ...options.headers,
        Cookie: cookies,
      };
    }

    try {
      // Agregar headers de Origin y Referer para endpoints de auth
      if (test.endpoint.includes("/auth/")) {
        options.headers = {
          ...options.headers,
          Origin: "http://localhost:3000",
          Referer: "http://localhost:3000/",
        };
      }

      const response = await fetch(url, options);

      const setCookie = response.headers.get("set-cookie");
      if (setCookie) {
        cookies = setCookie;
      }

      let success = response.status === test.expectedStatus;
      const isAnalyticsOrdersEndpoint =
        resolvedEndpoint.includes("/api/v1/analytics/orders?") ||
        resolvedEndpoint.includes("/api/v1/analytics/orders_detail?")  ;

      if (isAnalyticsOrdersEndpoint && test.expectedStatus === 200) {
        success = success && response.ok;
      }
      const status = success ? "" : "";

      if (success) {
        passed++;
      } else {
        failed++;
      }

      console.log(`${status} ${test.name}`);
      console.log(`   Endpoint: ${test.method} ${resolvedEndpoint}`);
      console.log(`   Status: ${response.status} (esperado: ${test.expectedStatus})`);
      console.log(`   Descripción: ${test.description}`);

      if (!success) {
        const data = await response.json();
        console.log(`   Respuesta: ${JSON.stringify(data)}`);
        console.log(`   Resultado: ? PRUEBA FALLIDA\n`);
      } else {
        console.log(`   Resultado: ? PRUEBA EXITOSA\n`);
      }

      console.log();
    } catch (error: any) {
      failed++;
      console.log(` ${test.name}`);
      console.log(`   Error: ${error.message}\n`);
    }
  }

  console.log("".repeat(80));
  console.log("\n RESUMEN DE PRUEBAS\n");
  console.log(`  Pruebas exitosas: ${passed}`);
  console.log(`  Pruebas fallidas: ${failed}`);
  console.log(` Total: ${testCases.length}\n`);

  if (failed === 0) {
    console.log(" ? ¡TODAS LAS PRUEBAS PASARON! Tu API está segura.\n");
  } else {
    console.log(` ? ${failed} prueba(s) fallaron. Revisa el código.\n`);
  }
}

async function verifyServer(): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}/api/health`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return response.status === 200;
  } catch {
    return false;
  }
}

async function main() {
  console.clear();
  console.log("?? Verificando conexión con el servidor...\n");

  const serverRunning = await verifyServer();

  if (!serverRunning) {
    console.log("".repeat(80));
    console.log("\n? ERROR: El servidor NO está corriendo\n");
    console.log("Por favor, inicia el servidor con: pnpm run dev\n");
    console.log("".repeat(80));
    process.exit(1);
  }

  console.log("? Servidor " + BASE_URL + " conectado correctamente.\n");
  console.log("".repeat(80));
  await runTests();
}

main().catch(console.error);
