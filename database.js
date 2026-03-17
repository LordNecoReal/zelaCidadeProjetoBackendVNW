const sqlite3 = require('sqlite3')
const {open} = require ('sqlite')

//Criando uma função assincrona
const criarBanco =async ()=> {

const db = await open({
filename: './database.db',
driver: sqlite3.Database

})

//Criando a tabela de incidentes

await db.exec(`
    CREATE TABLE IF NOT EXISTS incidentes(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tipo_problema TEXT,     --O que aconteceu(Buraco, Lixo,luz...)    
    localizacao TEXT,       --Onde Aconteceu (Rua, Bairro)
    descricao TEXT,         --Detalhes da reclamação
    prioridade TEXT         --Baixa,Média,Alta
    nome_solicitante TEXT,  --Quem ta avisando
    data_registro TEXT,     --Data em formato (ex 16/03 16.03)
    hora_registro TEXT,     --Hora que foi registrado
    status_resolucao TEXT DEFAULT 'Pendente'

    )
     

    `)

console.log("Banco de dados configurado: A tabela de registros urbanos está pronta")

}

criarBanco()