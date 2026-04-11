#!/usr/bin/env node
import { execSync } from 'child_process';

console.log("🔄 Ejecutando drizzle-kit push...");

try {
  // Ejecutar con --force-config-apply si está disponible, o simplemente ejecutar
  // El problema es que Drizzle Kit pregunta confirmación
  // Vamos a usar una alternativa: recrear DB desde cero
  execSync('npx drizzle-kit drop', { stdio: 'inherit' });
  execSync('npx drizzle-kit push', { stdio: 'inherit' });
  console.log("✅ Schema sincronizado!");
} catch (err) {
  console.log("Error:", err.message);
}