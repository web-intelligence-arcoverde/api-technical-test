import path from "node:path";
import winston from "winston";

const logDir = "logs";

// Definição de níveis de log personalizados (opcional, usando o padrão npm por agora)
const levels = {
	error: 0,
	warn: 1,
	info: 2,
	http: 3,
	debug: 4,
};

// Cores para os logs no console (apenas desenvolvimento)
const colors = {
	error: "red",
	warn: "yellow",
	info: "green",
	http: "magenta",
	debug: "white",
};

winston.addColors(colors);

// Formato comum para todos os transportes
const format = winston.format.combine(
	winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
	winston.format.errors({ stack: true }),
	winston.format.splat(),
	winston.format.json(),
);

// Formato específico para o console (mais legível em dev)
const consoleFormat = winston.format.combine(
	winston.format.colorize({ all: true }),
	winston.format.printf(
		(info) =>
			`${info.timestamp} ${info.level}: ${info.message}${info.stack ? `\n${info.stack}` : ""}`,
	),
);

// Instanciação do Logger
const logger = winston.createLogger({
	level: process.env.NODE_ENV === "development" ? "debug" : "info",
	levels,
	format,
	transports: [
		// 1. Console para log em tempo real
		new winston.transports.Console({
			format: consoleFormat,
		}),
		// 2. Arquivo para erros persistentes
		new winston.transports.File({
			filename: path.join(logDir, "error.log"),
			level: "error",
		}),
		// 3. Arquivo para todos os logs combinados
		new winston.transports.File({
			filename: path.join(logDir, "combined.log"),
		}),
	],
});

export default logger;
