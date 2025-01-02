-- Senha: admin123
INSERT OR IGNORE INTO users (name, email, phone, password, role)
VALUES (
    'Administrador',
    'admin@example.com',
    '(11) 99999-9999',
    '$2a$10$EKrfWJDNPHpMR1UKGQvz9.KdSFHH1yNkqmDn.TF0/k.xhcpxgU4Hy',
    'admin'
);
