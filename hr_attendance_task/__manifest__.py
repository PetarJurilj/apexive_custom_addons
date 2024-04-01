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
    'version': '17.0.3.2.2',

    'depends': ['hr_attendance', 'project'],
    'data': [
        'views/hr_attendance_view.xml',
    ],
    'assets': {
        'web.assets_backend': [
            'hr_attendance_task/static/src/components/**/*',
        ],
        'web.qunit_suite_tests': [
            'hr_attendance_task/static/tests/*.js',
        ],
    },
    'license': 'LGPL-3',
}
