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
                dev_pw = "adminpassword"
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
