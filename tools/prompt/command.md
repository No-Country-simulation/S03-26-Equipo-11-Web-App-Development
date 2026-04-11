 # instala los skill de acuerdo a la tecnologia del proyecto existente
 npx autoskills 

 # elimina los paquetes de node_modules que no se utilizan , puede se a nivel direcotior o global
 npx npkill  
 

 # mata el proceso que esta usando el puerto 3000
 netstat -ano | Select-String ":3000" | Select-String "LISTENING" | ForEach-Object { ($_ -split "\s+")[-1] } | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue } 
 
 # gemini yolo mode y resume

gemini -y -r

# codex yolo mode y resume
codex -a never resume

# qwen  resume
qwen -r
# opencode yolo y resume
opencode -c 