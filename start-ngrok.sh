# osascript -e "tell application \"Terminal\" to do script \"ngrok 8080\"" > /dev/null

  osascript 2>/dev/null <<EOF
    tell application "System Events"
      tell process "Terminal" to keystroke "t" using command down
    end
    tell application "Terminal"
      # activate
      do script with command "ngrok 8080; $*" in window 1
    end tell
  EOF