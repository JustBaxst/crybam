# Список папок и файлов, которые не должны попасть в дерево
$exclude = @(
    'node_modules', '.next', '.git', 'dev.db', 'dev.db-journal',
    '.vscode', '.agents', '.claude', '.windsurf',
    'tsconfig.tsbuildinfo',
    'dramas.txt', 'import-dramas.mjs', 'check-db.mjs', 'fill-name-lower.mjs'
)

function Show-Tree {
    param([string]$Path, [string]$Prefix = '')
    $items = Get-ChildItem -Path $Path -Force | 
        Where-Object { $exclude -notcontains $_.Name } | 
        Sort-Object @{Expression={-not $_.PSIsContainer}}, Name
    for ($i = 0; $i -lt $items.Count; $i++) {
        $item = $items[$i]
        $isLast = $i -eq ($items.Count - 1)
        $connector = if ($isLast) { '└── ' } else { '├── ' }
        $newPrefix = if ($isLast) { '    ' } else { '│   ' }
        if ($item.PSIsContainer) {
            "$Prefix$connector$($item.Name)/"
            Show-Tree -Path $item.FullName -Prefix "$Prefix$newPrefix"
        } else {
            "$Prefix$connector$($item.Name)"
        }
    }
}

Show-Tree -Path . | Out-File -Encoding utf8 tree.txt
Write-Host "✅ Дерево сохранено в tree.txt" -ForegroundColor Green