WITH cur_user AS (
    INSERT INTO users VALUES (DEFAULT)
    RETURNING *
),
temp AS (
    INSERT INTO user_credentials_password (username, bcrypted_pword, user_id)
    SELECT 'asdsdassasdfdfa', 'hashed password lol', cur_user.id
    FROM cur_user
)
SELECT * FROM cur_user;

 

SELECT users.*, cred.bcrypted_pword as password_hash
FROM user_credentials_password as cred JOIN users
ON cred.user_id = users.id
WHERE cred.username='lololo_username'
