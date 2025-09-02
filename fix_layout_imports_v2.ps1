# Script amélioré pour corriger tous les fichiers React

$files = @(
    "c:\Users\ahake\Linkompta\frontend\src\pages\ClientsComptable.js",
    "c:\Users\ahake\Linkompta\frontend\src\pages\DocumentsClient.js",
    "c:\Users\ahake\Linkompta\frontend\src\pages\DocumentsComptable.js",
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
        
        # Supprimer toutes les lignes contenant Layout import
        $lines = $content -split "`r?`n"
        $filteredLines = @()
        
        foreach ($line in $lines) {
            if ($line -notmatch "import.*Layout.*from") {
                $filteredLines += $line
            }
        }
        
        $content = $filteredLines -join "`n"
        
        # Remplacer les balises Layout
        $content = $content -replace '<Layout[^>]*>', '<div>'
        $content = $content -replace '</Layout>', '</div>'
        
        # Sauvegarder le fichier
        Set-Content $file -Value $content -NoNewline -Encoding UTF8
        
        Write-Host "Fichier corrigé: $file"
    } else {
        Write-Host "Fichier non trouvé: $file"
    }
}

Write-Host "Correction terminée!"
