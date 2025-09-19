-- Script para borrar todas las citas agendadas
-- Ejecuta esto en tu Supabase SQL Editor

-- Primero, veamos qué citas hay actualmente
SELECT 
    id,
    user_id,
    scheduled_date,
    status,
    check_in_type,
    notes,
    created_at
FROM coaching_check_ins 
ORDER BY created_at DESC;

-- Borrar todas las citas agendadas
DELETE FROM coaching_check_ins;

-- También borrar cualquier progreso relacionado
DELETE FROM coaching_progress;

-- Verificar que se borraron
SELECT COUNT(*) as remaining_check_ins FROM coaching_check_ins;
SELECT COUNT(*) as remaining_progress_entries FROM coaching_progress;
