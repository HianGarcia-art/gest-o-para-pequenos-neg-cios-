app.post('/api/vendas', (req, res) => {
    const { produto_id, quantidade } = req.body;

    db.get(`SELECT * FROM produtos WHERE id = ?`, [produto_id], (err, produto) => {
        if (err) return res.status(500).send(err.message);

        if (!produto) return res.status(404).send("Produto não encontrado");

        if (produto.quantidade < quantidade) {
            return res.status(400).send("Estoque insuficiente");
        }

        const total = produto.preco * quantidade;

        db.run(
            `INSERT INTO vendas (produto_id, quantidade, total) VALUES (?, ?, ?)`,
            [produto_id, quantidade, total],
            function (err) {
                if (err) return res.status(500).send(err.message);

                db.run(
                    `UPDATE produtos SET quantidade = quantidade - ? WHERE id = ?`,
                    [quantidade, produto_id]
                );

                res.send({ message: "Venda realizada com sucesso!" });
            }
        );
    });
});
