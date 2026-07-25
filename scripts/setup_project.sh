#!/bin/bash
echo "Setting up JeevanSetu Environment..."
cd frontend && npm install && cd ..
cd backend && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt && cd ..
echo "Setup complete."
