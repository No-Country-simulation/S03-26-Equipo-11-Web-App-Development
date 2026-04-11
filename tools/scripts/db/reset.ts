// Reset de Base de Datos - Startup CRM
// ADVERTENCIA: Elimina todos los datos!

import { closeConnection, databaseUrl, isLocalFileDatabase, testConnection } from "./index.js";
import { existsSync, unlinkSync } from "fs";

const dbFilePath = isLocalFileDatabase(databaseUrl) ? databaseUrl.replace("file:", "") : null;

async function resetDatabase() {
  console.log("");
  console.log("################################################");
  console.log("#  RESET DE BASE DE DATOS                    #");
  console.log("################################################");
  console.log("");

  // Test conexion
  if (!(await testConnection())) {
    console.error("\nNo se puede conectar a la base de datos");
    process.exit(1);
  }

  if (!dbFilePath) {
    console.error("Reset por archivo solo aplica a bases locales `file:`.");
    console.error(`Base configurada: ${databaseUrl}`);
    process.exit(1);
  }

  // Pedir confirmacion
  console.log("ADVERTENCIA: Esta operacion eliminara TODOS los datos!");
  console.log("Archivo: " + dbFilePath);
  console.log("");

  // En scripts automatizados, ejecutar sin confirmacion
  // Para uso manual, descomentar la siguiente linea
  // const readline = await import("readline");
  // const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  
  // Confirmacion automatica para CI/CD
  const confirm = process.argv.includes("--force") || process.argv.includes("-f");
  
  if (!confirm) {
    console.log("Para ejecutar, usar: npx tsx db/reset.ts --force");
    console.log("");
    process.exit(0);
  }

  console.log("Ejecutando reset...\n");

  // Cerrar conexion
  await closeConnection();

  // Eliminar archivo
  if (existsSync(dbFilePath)) {
    try {
      unlinkSync(dbFilePath);
      console.log("  Archivo de base de datos eliminado");
      
      // Eliminar WAL y SHM si existen
      const walPath = dbFilePath + "-wal";
      const shmPath = dbFilePath + "-shm";
      
      if (existsSync(walPath)) unlinkSync(walPath);
      if (existsSync(shmPath)) unlinkSync(shmPath);
      
      console.log("  Archivos WAL/SHM eliminados");
    } catch (error) {
      console.error("  Error al eliminar archivo:", error);
      process.exit(1);
    }
  } else {
    console.log("  No existe archivo de base de datos");
  }

  console.log("");
  console.log("Reset completado!");
  console.log("Ejecutar 'npm run db:seed' para crear datos iniciales");
  console.log("");
}

// Ejecutar
resetDatabase()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
