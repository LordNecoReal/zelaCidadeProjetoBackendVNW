const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

// Criando uma função assíncrona
const criarBanco = async () => {
  const db = await open({
    filename: "./database.db",
    driver: sqlite3.Database,
  });

  // Criando a tabela de incidentes
  await db.exec(`
    CREATE TABLE IF NOT EXISTS incidentes(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tipo_problema TEXT,                -- O que aconteceu (Buraco, Lixo, Luz...)
        localizacao TEXT,                  -- Onde aconteceu (Rua, Bairro)
        descricao TEXT,                    -- Detalhes da reclamação
        prioridade TEXT,                   -- Baixa, Média ou Alta   
        nome_solicitante TEXT,             -- Quem está avisando
        data_registro TEXT,                -- Data em formato (ex: 2026-03-16)
        hora_registro TEXT,                -- Hora que foi registrado
        status_resolucao TEXT DEFAULT 'Pendente' -- O banco define automaticamente como 'Pendente'
    )
  `);

  console.log(
    "Banco de dados configurado: A tabela de registros urbanos está pronta!",
  );

  // ============================
  // Insert - C do CRUD - CREATE
  // ============================

  await db.exec(`
    INSERT INTO incidentes(tipo_problema, localizacao, descricao, prioridade, nome_solicitante, data_registro, hora_registro) VALUES
    ("Iluminação", "Rua das Flores, 123, Bairro das Margaridas", "Poste queimado há dias", "Média", "Ana Clara", "2026-03-16", "10:30"),
    ("Falta de energia", "Hospital JP2", "Local na escuridão", "Alta", "Antônio Perna Quebrada", "2026-03-16", "22:15"),
    ("Vazamento de água", "Rua das Camélias, 52", "Vazamento de água constante próximo ao bueiro.", "Alta", "Julia Martins", "2026-03-16", "10:00"),
    ("Pavimentação", "Avenida C, Bairro D", "Calçada em mau estado", "Alta", "Maria Oliveira", "2026-03-14", "14:30"),
    ("Falta de água", "Rua T, 146, Jardim Imbariê", "Moradores sem água", "Alta", "Dona Fofoca", "2026-03-16", "10:00")
`);

  // ============================
  // Select  - R do CRUD - READ
  // ============================

  const todosOsIncidentes = await db.all("SELECT * FROM incidentes");
  console.table(todosOsIncidentes);

  // É sempre bom fechar a conexão após o uso
  await db.close();
};

criarBanco();