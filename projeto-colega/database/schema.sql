CREATE DATABASE IF NOT EXISTS pitecoflow
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE pitecoflow;

CREATE TABLE IF NOT EXISTS maquinas (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  setor VARCHAR(80) NOT NULL,
  tipo VARCHAR(80) NOT NULL,
  status ENUM('Em operação', 'Em manutenção', 'Parada', 'Desativada') NOT NULL DEFAULT 'Em operação',
  consumo_energia DECIMAL(10,2) UNSIGNED NOT NULL DEFAULT 0,
  temperatura DECIMAL(6,2) NULL,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_maquinas_status (status)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS producoes (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  produto VARCHAR(120) NOT NULL,
  quantidade_produzida INT UNSIGNED NOT NULL,
  quantidade_esperada INT UNSIGNED NOT NULL,
  data DATE NOT NULL DEFAULT (CURRENT_DATE),
  maquina_id INT UNSIGNED NOT NULL,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_quantidade_esperada CHECK (quantidade_esperada > 0),
  CONSTRAINT fk_producoes_maquinas FOREIGN KEY (maquina_id) REFERENCES maquinas(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  INDEX idx_producoes_maquina (maquina_id),
  INDEX idx_producoes_data (data)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS sustentabilidade (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  consumo_energia DECIMAL(12,2) UNSIGNED NOT NULL DEFAULT 0,
  consumo_agua DECIMAL(12,2) UNSIGNED NOT NULL DEFAULT 0,
  residuos DECIMAL(12,2) UNSIGNED NOT NULL DEFAULT 0,
  quantidade_reciclada DECIMAL(12,2) UNSIGNED NOT NULL DEFAULT 0,
  data DATE NOT NULL DEFAULT (CURRENT_DATE),
  CONSTRAINT chk_reciclagem CHECK (quantidade_reciclada <= residuos)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS ocorrencias (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  tipo VARCHAR(100) NOT NULL,
  descricao TEXT NOT NULL,
  nivel_risco ENUM('Baixo', 'Médio', 'Alto', 'Crítico') NOT NULL,
  local VARCHAR(120) NOT NULL,
  data DATE NOT NULL DEFAULT (CURRENT_DATE),
  medida_preventiva TEXT NULL,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
