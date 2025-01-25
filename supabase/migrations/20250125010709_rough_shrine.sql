/*
  # Criação da tabela de transações financeiras

  1. Nova Tabela
    - `transactions`
      - `id` (uuid, chave primária)
      - `user_id` (uuid, referência ao usuário autenticado)
      - `description` (texto)
      - `amount` (decimal)
      - `type` (enum: 'entrada' ou 'saida')
      - `category` (texto)
      - `date` (timestamp com timezone)
      - `created_at` (timestamp com timezone)

  2. Segurança
    - Habilitar RLS na tabela transactions
    - Adicionar políticas para usuários autenticados
*/

CREATE TYPE transaction_type AS ENUM ('entrada', 'saida');

CREATE TABLE IF NOT EXISTS transactions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) NOT NULL,
    description text NOT NULL,
    amount decimal(10,2) NOT NULL,
    type transaction_type NOT NULL,
    category text NOT NULL,
    date timestamptz NOT NULL,
    created_at timestamptz DEFAULT now()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Política para inserir transações
CREATE POLICY "Users can insert their own transactions"
    ON transactions
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Política para visualizar transações
CREATE POLICY "Users can view their own transactions"
    ON transactions
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Política para atualizar transações
CREATE POLICY "Users can update their own transactions"
    ON transactions
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Política para deletar transações
CREATE POLICY "Users can delete their own transactions"
    ON transactions
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);