CREATE OR REPLACE FUNCTION increment_message_count(conv_id uuid, amount int)
RETURNS void AS $$
  UPDATE conversations
  SET message_count = message_count + amount
  WHERE id = conv_id;
$$ LANGUAGE sql;
