const pm2 = require("pm2");
const os = require("os");

const APP_NAME = "shopping-list-api";
const MAX_INSTANCES = os.cpus().length; // Nunca passe do número de núcleos
const MIN_INSTANCES = 2; // Mantenha pelo menos 2 para alta disponibilidade

const SCALE_UP_CPU_THRESHOLD = 70; // Escala se CPU média > 70%
const SCALE_DOWN_CPU_THRESHOLD = 20; // Reduz se CPU média < 20%
const CHECK_INTERVAL_MS = 10000; // Checa a cada 10 segundos

pm2.connect((err) => {
	if (err) {
		console.error("Erro ao conectar no PM2:", err);
		process.exit(2);
	}

	console.log(`[AutoScaler] Iniciado. Limite de instâncias: ${MAX_INSTANCES}`);

	setInterval(() => {
		pm2.list((err, processList) => {
			if (err) return console.error("Erro ao listar processos:", err);

			// Filtra apenas os processos do nosso app
			const appProcesses = processList.filter((p) => p.name === APP_NAME);

			if (appProcesses.length === 0) return;

			const currentInstances = appProcesses.length;

			// Calcula a média de uso de CPU de todas as instâncias do app
			const totalCpu = appProcesses.reduce((acc, p) => acc + p.monit.cpu, 0);
			const avgCpu = totalCpu / currentInstances;

			console.log(
				`[AutoScaler] Instâncias: ${currentInstances} | CPU Média: ${avgCpu.toFixed(2)}%`,
			);

			// Regra para Escalar (Scale Up)
			if (avgCpu > SCALE_UP_CPU_THRESHOLD && currentInstances < MAX_INSTANCES) {
				const newInstances = currentInstances + 1;
				console.log(
					`[AutoScaler] ALERTA: CPU alta! Escalando para ${newInstances} instâncias...`,
				);
				pm2.scale(APP_NAME, newInstances, (err) => {
					if (err) console.error("Erro ao escalar para cima:", err);
				});
			} else if (
				avgCpu < SCALE_DOWN_CPU_THRESHOLD &&
				currentInstances > MIN_INSTANCES
			) {
				const newInstances = currentInstances - 1;
				console.log(
					`[AutoScaler] Tráfego baixo. Reduzindo para ${newInstances} instâncias...`,
				);
				pm2.scale(APP_NAME, newInstances, (err) => {
					if (err) console.error("Erro ao escalar para baixo:", err);
				});
			}
		});
	}, CHECK_INTERVAL_MS);
});
