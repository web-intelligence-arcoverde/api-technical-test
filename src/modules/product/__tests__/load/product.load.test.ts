import { randomBytes } from "node:crypto";
import autocannon from "autocannon";
import axios from "axios";

const TARGET_URL = process.env.TARGET_URL || "http://localhost:3001";

const runTest = async (name: string, options: any) => {
	console.log(`\n🚀 Starting Load Test: ${name}`);
	console.log(`📍 URL: ${options.url}`);

	return new Promise((resolve, reject) => {
		const instance = autocannon(options, (err: any, result: any) => {
			if (err) {
				console.error(`❌ Error in ${name}:`, err);
				reject(err);
				return;
			}
			console.log(`\n✅ Finished Load Test: ${name}`);
			console.log(autocannon.printResult(result));
			resolve(result);
		});

		autocannon.track(instance, { renderProgressBar: true });
	});
};

const setupTestData = async () => {
	const randomSuffix = randomBytes(4).toString("hex");
	const email = `prodtest_${randomSuffix}@example.com`;
	const password = "password123";

	try {
		console.log(`📝 Registering user: ${email}`);
		await axios.post(`${TARGET_URL}/auth/register`, {
			name: "Product Load Test User",
			email,
			password,
		});

		console.log("🔑 Logging in...");
		const loginRes = await axios.post(`${TARGET_URL}/auth/login`, {
			email,
			password,
		});
		const token = loginRes.data.token;

		console.log("📝 Creating initial shopping list...");
		const listRes = await axios.post(
			`${TARGET_URL}/shopping-list`,
			{
				title: "Load Test Products List",
				category: "StressTest",
				variant: "primary",
				items: [],
			},
			{ headers: { authorization: `Bearer ${token}` } },
		);
		const listId = listRes.data.id;

		console.log("📝 Creating initial product...");
		const prodRes = await axios.post(
			`${TARGET_URL}/product`,
			{
				name: "Initial Product",
				category: "Test",
				marketName: "Test Market",
				price: 10,
				quantity: 1,
				unit: "un",
				checked: false,
				listId,
			},
			{ headers: { authorization: `Bearer ${token}` } },
		);
		const productId = prodRes.data.id;

		return { token, listId, productId };
	} catch (error) {
		console.error(
			"❌ Failed to setup test data. Make sure the server is running.",
		);
		throw error;
	}
};

const startLoadTests = async () => {
	try {
		const { token, listId, productId } = await setupTestData();
		console.log("✅ Data setup successfully.");

		// 1. List Products Load Test (GET)
		await runTest("Product - Listing", {
			url: `${TARGET_URL}/product?listId=${listId}`,
			method: "GET",
			headers: {
				"content-type": "application/json",
				authorization: `Bearer ${token}`,
				"x-load-test-bypass": "true",
			},
			connections: 10,
			duration: 10,
		});

		// 2. Create Product Load Test (POST)
		await runTest("Product - Creation", {
			url: `${TARGET_URL}/product`,
			method: "POST",
			headers: {
				"content-type": "application/json",
				authorization: `Bearer ${token}`,
				"x-load-test-bypass": "true",
			},
			body: JSON.stringify({
				name: "Load Test Product",
				category: "StressTest",
				marketName: "Stress Market",
				price: 1.99,
				quantity: 5,
				unit: "un",
				checked: false,
				listId,
			}),
			connections: 5,
			duration: 10,
		});

		// 3. Toggle Product Status Load Test (PATCH)
		await runTest("Product - Toggle Status", {
			url: `${TARGET_URL}/product/${productId}/toggle-checked`,
			method: "PATCH",
			headers: {
				"content-type": "application/json",
				authorization: `Bearer ${token}`,
				"x-load-test-bypass": "true",
			},
			body: JSON.stringify({
				checked: true,
			}),
			connections: 5,
			duration: 10,
		});
	} catch (error) {
		console.error("Critical error running load tests:", error);
		process.exit(1);
	}
};

startLoadTests();
