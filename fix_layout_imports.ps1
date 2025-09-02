# Script pour supprimer les imports Layout de tous les fichiers React

$files = @(
    "c:\Users\ahake\Linkompta\frontend\src\pages\ClientProfil.js",
    "c:\Users\ahake\Linkompta\frontend\src\pages\ClientsComptable.js",
    "c:\Users\ahake\Linkompta\frontend\src\pages\DocumentsClient.js",
    "c:\Users\ahake\Linkompta\frontend\src\pages\DocumentsComptable.js",
    "c:\Users\ahake\Linkompta\frontend\src\pages\FacturesClient.js",
    "c:\Users\ahake\Linkompta\frontend\src\pages\FacturesComptable.js",
    "c:\Users\ahake\Linkompta\frontend\src\pages\Messagerie.js",
    "c:\Users\ahake\Linkompta\frontend\src\pages\Profil.js",
    "c:\Users\ahake\Linkompta\frontend\src\pages\RendezVousClient.js",
    "c:\Users\ahake\Linkompta\frontend\src\pages\RendezVousComptable.js"
)

foreach ($file in $files) {
    Write-Host "Correction du fichier: $file"
    
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        
        # Supprimer la ligne d'import Layout
        $content = $content -replace 'import Layout from [^;]+;?\r?\n', ''
        
        # Remplacer <Layout...> par <div>
        $content = $content -replace '<Layout[^>]*>', '<div>'
        
        # Remplacer </Layout> par </div>
        $content = $content -replace '</Layout>', '</div>'
        
        # Sauvegarder le fichier
        Set-Content $file -Value $content -NoNewline
        
        Write-Host "Fichier corrigé: $file"
    } else {
        Write-Host "Fichier non trouvé: $file"
    }
}

Write-Host "Correction terminée!"
