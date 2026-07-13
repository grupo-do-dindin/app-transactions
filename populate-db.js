const fs = require("fs");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Popular por quanto? ", (qty) => {
  const count = parseInt(qty, 10);
  if (isNaN(count) || count <= 0) {
    console.log("Número inválido!");
    rl.close();
    return;
  }

  const server = JSON.parse(fs.readFileSync("server.json", "utf-8"));
  const categories = ["Alimentação", "Transporte", "Lazer", "Saúde", "Educação"];
  const descriptions = ["Compra", "Gasto", "Pagamento", "Transferência", "Venda"];

  console.log(`\nAdicionando ${count} registros em server.json`);

  for (let i = 0; i < count; i++) {
    const isIncome = Math.random() > 0.6;
    const price = +(Math.random() * 5000).toFixed(2);
    server.transactions.push({
      id: Date.now() + i,
      createdAt: new Date(Date.now() - Math.random() * 2592000000).toISOString(),
      price: isIncome ? price : -price,
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      type: isIncome ? "income" : "outcome",
      category: categories[Math.floor(Math.random() * categories.length)],
    });
  }

  fs.writeFileSync("server.json", JSON.stringify(server, null, 2));
  console.log("Concluído\n");
  rl.close();
});
