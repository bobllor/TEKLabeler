function func(){
    param (
        [string] $source
    )

    $output = "output\app"

    cp -recurse -force "$source" "$output"
}

$outputFolder = "output"
if(test-path "dist"){
    echo "Removing existing dist\"
    rm -recurse -force dist/ -ea 0
}
if(test-path $outputFolder){
    echo "Removing existing $outputFolder\"
    rm -recurse -force $outputFolder -ea 0
}

npm run build
pyinstaller --onefile --noconsole --icon "./icon.ico" --name "TEKLabeler" ./backend/main.py --distpath "$outputFolder\app"

func templates
func docs
func imgs
func dist

# ensures we dont package these files it if exists.
rm -recurse -force "$outputFolder\app\cfg" -ea 0
rm -recurse -force "$outputFolder\app\templates\assets" -ea 0

# decluttering the root folder
if(test-path $outputFolder){
    mv dist $outputFolder -ea 0
    mv TEKLabeler.spec $outputFolder -ea 0
}

$root = (pwd).path

cd "$outputFolder\app"
compress-archive -force . ../package.zip -compressionlevel optimal

cd "$root"
$isccPath = "C:\Program Files (x86)\Inno Setup 6\ISCC.exe"
if(test-path $isccPath){
    & "$isccPath" ".\compile-installer.iss" "/DSrcPath=$($pwd.path)" "/DMyAppVersion=$(type ".\VERSION.txt")"
}else{
    write-error "Inno Setup is not installed on the device"
}