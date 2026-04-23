# ============================================================
# Project Title : Contact Management System (Experiment 6)
# Author        : [Your Name]
# Date          : April 2026
# Description   : A Flask-based CRUD Contact Manager without
#                 a database — contacts stored in a Python list.
# ============================================================

from flask import Flask, render_template, request, redirect, url_for

# --------------- App Initialization ---------------
app = Flask(__name__)

# --------------- In-Memory Contact Storage ---------------
# Each contact is a dict: { id, name, phone, email }
contacts = []       # List that holds all contact dictionaries
next_id  = 1        # Auto-increment counter for unique IDs


# =====================================================
# ROUTE 1: Home — Read / List all contacts (with search)
# =====================================================
@app.route('/')
def index():
    """
    Display all contacts on the home page.
    If a search query is provided via ?q=..., filter results
    by name or phone number (case-insensitive).
    """
    query   = request.args.get('q', '').strip().lower()
    results = contacts  # Start with all contacts

    if query:
        # Filter contacts whose name OR phone contains the query
        results = [
            c for c in contacts
            if query in c['name'].lower() or query in c['phone'].lower()
        ]

    return render_template('index.html', contacts=results, query=query)


# =====================================================
# ROUTE 2: Add Contact (Create Operation)
# =====================================================
@app.route('/add', methods=['GET', 'POST'])
def add_contact():
    """
    GET  → Show blank add-contact form.
    POST → Validate inputs and save the new contact.
    """
    global next_id
    error = None  # Holds validation error message if any

    if request.method == 'POST':
        name  = request.form.get('name',  '').strip()
        phone = request.form.get('phone', '').strip()
        email = request.form.get('email', '').strip()

        # Basic validation — all three fields are required
        if not name or not phone or not email:
            error = "All fields (Name, Phone, Email) are required."
        else:
            new_contact = {
                'id'   : next_id,
                'name' : name,
                'phone': phone,
                'email': email
            }
            contacts.append(new_contact)  # Save to in-memory list
            next_id += 1                  # Increment ID counter
            return redirect(url_for('index'))

    return render_template('add_contact.html', error=error)


# =====================================================
# ROUTE 3: Edit Contact (Update Operation)
# =====================================================
@app.route('/edit/<int:contact_id>', methods=['GET', 'POST'])
def edit_contact(contact_id):
    """
    GET  → Show edit form pre-filled with existing contact data.
    POST → Validate and save updated data.
    contact_id: integer ID of the contact to edit.
    """
    # Find the contact with the matching ID
    contact = next((c for c in contacts if c['id'] == contact_id), None)

    # If not found, redirect home gracefully
    if contact is None:
        return redirect(url_for('index'))

    error = None

    if request.method == 'POST':
        name  = request.form.get('name',  '').strip()
        phone = request.form.get('phone', '').strip()
        email = request.form.get('email', '').strip()

        if not name or not phone or not email:
            error = "All fields (Name, Phone, Email) are required."
        else:
            # Mutate the dict in-place — no need to rebuild the list
            contact['name']  = name
            contact['phone'] = phone
            contact['email'] = email
            return redirect(url_for('index'))

    return render_template('edit_contact.html', contact=contact, error=error)


# =====================================================
# ROUTE 4: Delete Contact (Delete Operation)
# =====================================================
@app.route('/delete/<int:contact_id>', methods=['POST'])
def delete_contact(contact_id):
    """
    Remove the contact with the given ID from the list.
    POST-only to prevent accidental deletion via direct URL.
    contact_id: integer ID of the contact to delete.
    """
    global contacts
    # Rebuild list excluding the contact to delete
    contacts = [c for c in contacts if c['id'] != contact_id]
    return redirect(url_for('index'))


# =====================================================
# Entry Point
# =====================================================
if __name__ == '__main__':
    app.run(debug=True)