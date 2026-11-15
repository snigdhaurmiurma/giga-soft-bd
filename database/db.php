<?php
/**
 * GIGA SOFT LIMITED — DATABASE & INQUIRY STORAGE ENGINE
 * Dual Storage Architecture: SQLite (PDO) with Automated JSON Ledger Fallback
 */

define('GSL_DB_DIR', __DIR__);
define('GSL_SQLITE_PATH', GSL_DB_DIR . '/giga_soft.sqlite');
define('GSL_INQUIRIES_JSON', GSL_DB_DIR . '/inquiries.json');

/**
 * Initialize and return PDO SQLite instance
 */
function gsl_get_db() {
    static $pdo = null;
    if ($pdo !== null) {
        return $pdo;
    }

    try {
        if (!class_exists('PDO') || !in_array('sqlite', PDO::getAvailableDrivers())) {
            return null;
        }

        $pdo = new PDO('sqlite:' . GSL_SQLITE_PATH);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

        // Create table schema if not exists
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS inquiries (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                reference_id TEXT UNIQUE,
                name TEXT,
                email TEXT,
                phone TEXT,
                service TEXT,
                message TEXT,
                page_url TEXT,
                ip_address TEXT,
                user_agent TEXT,
                status TEXT DEFAULT 'New',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        ");

        return $pdo;
    } catch (Exception $e) {
        error_log('GSL Database Connection Error: ' . $e->getMessage());
        return null;
    }
}

/**
 * Save consultation inquiry to database
 */
function gsl_save_inquiry($data) {
    $refId = 'GSL-' . substr(time(), -6);
    $savedToSqlite = false;

    $pdo = gsl_get_db();
    if ($pdo) {
        try {
            $stmt = $pdo->prepare("
                INSERT INTO inquiries (reference_id, name, email, phone, service, message, page_url, ip_address, user_agent, status)
                VALUES (:ref, :name, :email, :phone, :service, :message, :page, :ip, :ua, 'New')
            ");
            $stmt->execute([
                ':ref'     => $refId,
                ':name'    => $data['name'] ?? '',
                ':email'   => $data['email'] ?? '',
                ':phone'   => $data['phone'] ?? '',
                ':service' => $data['service'] ?? '',
                ':message' => $data['message'] ?? '',
                ':page'    => $data['page_url'] ?? '',
                ':ip'      => $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1',
                ':ua'      => $_SERVER['HTTP_USER_AGENT'] ?? ''
            ]);
            $savedToSqlite = true;
        } catch (Exception $e) {
            error_log('SQLite Insert Error: ' . $e->getMessage());
        }
    }

    // JSON Ledger Backup
    try {
        $existing = [];
        if (file_exists(GSL_INQUIRIES_JSON)) {
            $content = file_get_contents(GSL_INQUIRIES_JSON);
            $existing = json_decode($content, true) ?: [];
        }

        array_unshift($existing, [
            'reference_id' => $refId,
            'name'         => $data['name'] ?? '',
            'email'        => $data['email'] ?? '',
            'phone'        => $data['phone'] ?? '',
            'service'      => $data['service'] ?? '',
            'message'      => $data['message'] ?? '',
            'page_url'     => $data['page_url'] ?? '',
            'created_at'   => date('Y-m-d H:i:s'),
            'status'       => 'New'
        ]);

        if (count($existing) > 500) {
            $existing = array_slice($existing, 0, 500);
        }

        file_put_contents(GSL_INQUIRIES_JSON, json_encode($existing, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
    } catch (Exception $e) {
        error_log('JSON Ledger Error: ' . $e->getMessage());
    }

    return $refId;
}
