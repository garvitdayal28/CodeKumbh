"""
Backend Migration Script
Helps switch between old monolithic and new modular backend
"""
import os
import shutil
from datetime import datetime

def backup_file(filepath):
    """Create a backup of a file with timestamp"""
    if os.path.exists(filepath):
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_path = f"{filepath}.backup_{timestamp}"
        shutil.copy2(filepath, backup_path)
        print(f"✅ Backed up: {filepath} -> {backup_path}")
        return backup_path
    return None

def migrate_to_new():
    """Migrate from old to new modular structure"""
    print("\n" + "="*60)
    print("🚀 MIGRATING TO NEW MODULAR BACKEND")
    print("="*60 + "\n")
    
    # Backup old app.py
    print("📦 Step 1: Backing up old app.py...")
    backup_file("app.py")
    
    # Rename old app.py
    print("\n📝 Step 2: Renaming old app.py to app_old.py...")
    if os.path.exists("app.py"):
        os.rename("app.py", "app_old.py")
        print("✅ Renamed: app.py -> app_old.py")
    
    # Rename new app to main
    print("\n📝 Step 3: Activating new modular app.py...")
    if os.path.exists("app_new.py"):
        shutil.copy2("app_new.py", "app.py")
        print("✅ Activated: app_new.py -> app.py")
    
    print("\n" + "="*60)
    print("✅ MIGRATION COMPLETE!")
    print("="*60)
    print("\n📌 Next steps:")
    print("   1. Test the new backend: python app.py")
    print("   2. Verify all endpoints work")
    print("   3. Check frontend integration")
    print("\n💡 To rollback: python migrate.py --rollback\n")

def rollback_to_old():
    """Rollback to old monolithic structure"""
    print("\n" + "="*60)
    print("⏪ ROLLING BACK TO OLD BACKEND")
    print("="*60 + "\n")
    
    # Backup current app.py
    print("📦 Step 1: Backing up current app.py...")
    backup_file("app.py")
    
    # Restore old app.py
    print("\n📝 Step 2: Restoring old app.py...")
    if os.path.exists("app_old.py"):
        shutil.copy2("app_old.py", "app.py")
        print("✅ Restored: app_old.py -> app.py")
    else:
        print("❌ Error: app_old.py not found!")
        return
    
    print("\n" + "="*60)
    print("✅ ROLLBACK COMPLETE!")
    print("="*60)
    print("\n📌 Old monolithic backend is now active\n")

def show_status():
    """Show current backend status"""
    print("\n" + "="*60)
    print("📊 BACKEND STATUS")
    print("="*60 + "\n")
    
    files = {
        "app.py": "Current active backend",
        "app_old.py": "Old monolithic backend",
        "app_new.py": "New modular backend",
        "config/": "Configuration modules",
        "routes/": "Blueprint routes",
        "utils/": "Utility functions"
    }
    
    for file, description in files.items():
        exists = "✅" if os.path.exists(file) else "❌"
        print(f"{exists} {file:20s} - {description}")
    
    print("\n" + "="*60)
    
    # Check which version is active
    if os.path.exists("app.py"):
        with open("app.py", "r") as f:
            content = f.read()
            if "Blueprint" in content and "create_app" in content:
                print("🎯 Active: NEW MODULAR BACKEND")
            else:
                print("🎯 Active: OLD MONOLITHIC BACKEND")
    
    print("="*60 + "\n")

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1:
        command = sys.argv[1]
        
        if command == "--migrate" or command == "-m":
            migrate_to_new()
        elif command == "--rollback" or command == "-r":
            rollback_to_old()
        elif command == "--status" or command == "-s":
            show_status()
        else:
            print("❌ Unknown command!")
            print("\nUsage:")
            print("  python migrate.py --migrate   # Migrate to new backend")
            print("  python migrate.py --rollback  # Rollback to old backend")
            print("  python migrate.py --status    # Show current status")
    else:
        print("\n" + "="*60)
        print("🔧 BACKEND MIGRATION TOOL")
        print("="*60)
        print("\nUsage:")
        print("  python migrate.py --migrate   # Migrate to new modular backend")
        print("  python migrate.py --rollback  # Rollback to old backend")
        print("  python migrate.py --status    # Show current status")
        print("\nShort forms:")
        print("  -m  # Migrate")
        print("  -r  # Rollback")
        print("  -s  # Status")
        print("\n" + "="*60 + "\n")
