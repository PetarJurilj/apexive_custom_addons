# -*- coding: utf-8 -*-
{
    'name': 'Attendances Task & Project',

    'summary': 'Add option to add task and project when Check in/Check out',
    'description': """
This module aims to extend employee's attendances.
==================================================

Add option for task, project and description when Check in/Check out
       """,
    'author': 'My Company',
    'website': 'https://www.yourcompany.com',

    'category': 'Human Resources/Attendances',
    'version': '17.0.0.0.1',

    'depends': ['hr_attendance', 'project'],
    'data': [
        # 'security/ir.model.access.csv',
        # 'views/views.xml',
        # 'views/templates.xml',
    ],
    'assets': {
        'web.assets_backend': [
            'hr_attendance_task/static/src/components/**/*',
        ],
    },
    'license': 'LGPL-3',
}

