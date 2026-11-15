<?php
/**
 * GIGA SOFT LIMITED — LEADS READ API
 * Secure JSON endpoint for inquiries
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

require_once __DIR__ . '/../database/db.php';

$pdo = gsl_get_db();
if ($pdo) {
    try {
        $stmt = $pdo->query("SELECT * FROM inquiries ORDER BY id DESC LIMIT 100");
        $leads = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode([
            'status' => 'success',
            'count'  => count($leads),
            'leads'  => $leads
        ]);
        exit;
    } catch (Exception $e) {
        // Fallback to JSON file
    }
}

if (file_exists(GSL_INQUIRIES_JSON)) {
    $content = file_get_contents(GSL_INQUIRIES_JSON);
    $leads = json_decode($content, true) ?: [];
    echo json_encode([
        'status' => 'success',
        'count'  => count($leads),
        'leads'  => $leads
    ]);
    exit;
}

echo json_encode([
    'status' => 'success',
    'count'  => 0,
    'leads'  => []
]);
