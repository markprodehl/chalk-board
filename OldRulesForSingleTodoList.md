These are the old firebase rules that need to be added back within the firebase console
{
  "rules": {
    "todos": {
      "$uid": {
        ".read": "auth != null",
        ".write": "auth != null && $uid === auth.uid"
      }
    }
  }
}

These are the new rules for todos nested under boards
{
  "rules": {
    "boards": {
      "$uid": {
        ".read": "auth != null && auth.uid == $uid",
        ".write": "auth != null && auth.uid == $uid"
      }
    }
  }
}

Firebase backups 

Latest working deployed version without boards - 8d3916
Latest working version with boards - acec1c