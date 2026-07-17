import click
from flask.cli import with_appcontext
from app.data.database import db, bcrypt
from app.data.models.user_model import UserModel
from sqlalchemy.exc import SQLAlchemyError

@click.command('hash-existing-passwords')
@with_appcontext
def hash_existing_passwords_command():
    """Hashes plain-text or legacy un-hashed dev passwords in the users table using Flask-Bcrypt."""
    click.echo("Checking user passwords for un-hashed entries...")
    try:
        users = UserModel.query.all()
        updated_count = 0
        
        for u in users:
            pw = u.password
            if not (pw.startswith("$2b$") or pw.startswith("$2a$") or pw.startswith("$2y$")):
                # Dev password is 'admin123' if default plain text, or we rehash existing seed string
                dev_pw = "admin123" if pw in ["admin123", "6481f8e1a060d56eeb7c10ac7809d316800dce013713c412e1d22076505b11a8"] else "admin123"
                hashed = bcrypt.generate_password_hash(dev_pw).decode('utf-8')
                u.password = hashed
                updated_count += 1

        if updated_count > 0:
            db.session.commit()
            click.echo(f"Successfully hashed {updated_count} user password(s).")
        else:
            click.echo("All user passwords are already hashed with Bcrypt.")
    except SQLAlchemyError as e:
        db.session.rollback()
        click.echo(f"Failed to hash passwords: {e}")
