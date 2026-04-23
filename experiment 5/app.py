# ============================================================
# Project Title : Simple Blog Platform (Experiment 5)
# Author        : [Your Name]
# Date          : April 2026
# Description   : A Flask-based CRUD blog application without
#                 a database — posts are stored in a Python list.
# ============================================================

from flask import Flask, render_template, request, redirect, url_for

# --------------- App Initialization ---------------
app = Flask(__name__)

# --------------- In-Memory Post Storage ---------------
# Each post is a dict: { id, title, content }
# A counter is used to assign unique IDs to every new post.
posts = []          # List that holds all blog post dictionaries
next_id = 1         # Auto-increment counter for post IDs


# =====================================================
# ROUTE 1: Home — Read / List all posts
# =====================================================
@app.route('/')
def index():
    """Display all blog posts on the home page."""
    return render_template('index.html', posts=posts)


# =====================================================
# ROUTE 2: Create — Add a new post
# =====================================================
@app.route('/create', methods=['GET', 'POST'])
def create():
    """
    GET  → Show the blank create-post form.
    POST → Validate and save the new post, then redirect home.
    """
    global next_id          # We need to modify the global counter

    if request.method == 'POST':
        title   = request.form.get('title', '').strip()
        content = request.form.get('content', '').strip()

        # Basic validation — both fields are required
        if title and content:
            new_post = {
                'id'     : next_id,
                'title'  : title,
                'content': content
            }
            posts.append(new_post)  # Add to our in-memory list
            next_id += 1            # Increment the ID counter
            return redirect(url_for('index'))

    # GET request or failed validation → show the form
    return render_template('create.html')


# =====================================================
# ROUTE 3: Edit — Update an existing post
# =====================================================
@app.route('/edit/<int:post_id>', methods=['GET', 'POST'])
def edit(post_id):
    """
    GET  → Show the edit form pre-filled with existing data.
    POST → Save the updated data and redirect home.
    post_id: integer ID of the post to edit.
    """
    # Find the post with the matching ID
    post = next((p for p in posts if p['id'] == post_id), None)

    # If no post found, redirect to home gracefully
    if post is None:
        return redirect(url_for('index'))

    if request.method == 'POST':
        title   = request.form.get('title', '').strip()
        content = request.form.get('content', '').strip()

        # Update only when both fields have content
        if title and content:
            post['title']   = title     # Mutate the dict in-place
            post['content'] = content
            return redirect(url_for('index'))

    # GET → render form with current post data
    return render_template('edit.html', post=post)


# =====================================================
# ROUTE 4: Delete — Remove a post
# =====================================================
@app.route('/delete/<int:post_id>', methods=['POST'])
def delete(post_id):
    """
    Remove the post with the given ID from the list.
    Only accepts POST to prevent accidental deletions via URL.
    post_id: integer ID of the post to delete.
    """
    global posts
    # Rebuild the list excluding the post to delete
    posts = [p for p in posts if p['id'] != post_id]
    return redirect(url_for('index'))


# =====================================================
# Entry Point
# =====================================================
if __name__ == '__main__':
    # debug=True enables auto-reload on code changes (dev only)
    app.run(debug=True)