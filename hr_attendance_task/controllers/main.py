from odoo import http
from odoo.http import request
from odoo.addons.hr_attendance.controllers.main import HrAttendance


class HrAttendanceProjectTask(HrAttendance):
    @http.route('/hr_attendance/fetch_projects', type='json', auth='user')
    def fetch_projects(self):
        projects = request.env['project.project'].sudo().search_read(
            domain=[],
            fields=['id', 'name']
        )
        return projects
    
    @http.route('/hr_attendance/fetch_tasks', type='json', auth='user')
    def fetch_tasks(self, project_id):
        if project_id:
            project_id = int(project_id)
            
        tasks = request.env['project.task'].sudo().search_read(
            domain=[('project_id', '=', project_id)],
            fields=['id', 'name']
        )
        
        return tasks