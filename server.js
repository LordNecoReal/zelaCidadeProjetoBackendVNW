//Importações

const express = require("express"); //Framework que cria o servidor e as rotas
const { criarBanco } = require("./database"); //A chave que vai abrir a conexão com o banco de dados

const cors = require('cors') //Importando o pacote que gerencia as permissões de acesso

const app = express(); //Inicialização: Ligando o motor do servidor

//-------Ativando

app.use((cors)) //Ativando o CORS no servidor

app.use(express.json()); //Tradutor: Configura o Express para entender dados enviados no formato JSON

//Criando a Rota Principal /Rota Raiz

app.get("/", (req, res) => {
  //res.send: Envia uma resposta simples (texto, html, json)
  res.send(`
        <body>
    <h1> ZelaCidade </h1>
    <h2> Gestão de Problemas Urbanos </h2>
    <p> Endpoint que leva aos incidentes cadastrados: /incidentes </p> 
        </body>
        
        `);
});

//Porta do servidor

//Criando uma variavel inteligente para a porta

const PORT = process.env.PORT || 3000;

//Ligando o Servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});


//Rota de Listagem - Para buscar todos os problemas registrados

app.get("/incidentes", async (req, res) => {

const db = await criarBanco() // Chamamos a função do outro arquivo. O await é o "aguarde", pois o banco precisa de tempo para abrir. 

const listaIncidentes = await db.all(`SELECT * FROM incidentes`)

res.json(listaIncidentes) //Entrega esses dados para o cliente em formato JSON

} ) 


//Rota Específica 
app.get("/incidentes/:id", async (req, res) => {

const { id } = req.params

const db = await criarBanco()

const incidenteEspecifico = await db.all(`SELECT * FROM incidentes WHERE id = ?`, [id])
// ? é um espaço reservado que será preenchido pelo valor da variável [id]
// ? SQL Injection é usado para segurança 

res.json(incidenteEspecifico)
} )


//Rota POST - Novos Registros  /Endpoints 

app.post("/incidentes", async (req,res) => {

const {tipo_problema, localizacao, descricao, prioridade, nome_solicitante, data_registro, hora_registro} = req.body

const db = await criarBanco()

await db.run(`INSERT INTO incidentes(tipo_problema, localizacao, descricao, prioridade, nome_solicitante, data_registro, hora_registro) VALUES (?, ?, ?, ?, ?, ?, ?)`, [tipo_problema, localizacao, descricao, prioridade, nome_solicitante, data_registro, hora_registro])

//Envia uma resposta de confirmação para o cliente que fez a requisição
res.send(`Incidente novo registrado: ${tipo_problema} registrado na data ${data_registro} por ${nome_solicitante} `)
} )

//ROTA DE ATUALIZAÇÃO: Responsavel por editar um incidente já existente no banco
app.put('/incidentes/:id', async (req,res) => {
//Pega o id do incidente que vem pela URL (ex: /incidentes/11)
const { id } = req.params

const {prioridade,descricao,status_resolucao} = req.body
//Abre a conexão com o banco de dados
const db = await criarBanco()

await db.run (`
  UPDATE incidentes 
  SET prioridade = ?, descricao = ?, status_resolucao = ?
  WHERE id = ?


  `, [prioridade, descricao, status_resolucao, id])
res.send(' O incidente de ID ${id} foi atualizado com sucesso!!')

}) 