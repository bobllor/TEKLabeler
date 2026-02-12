function func(){
    param (
        [string] $source
    )

    $output = "output"

    cp -recurse -force "$source" "$output"
}

if(test-path "dist"){
    rm -recurse -force dist/ -ea 0
}

npm run build

# this also creates the output folder
pyinstaller --onefile --noconsole --icon "./icon.ico" --name "TEKLabeler" ./backend/main.py --distpath output

func templates
func docs
func imgs
func dist

# ensures we dont package the cfg it if exists.
rm -recurse -force output/cfg -ea silentlycontinue

cd output
compress-archive -force . ./package.zip -compressionlevel optimal