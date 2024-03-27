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

    @http.route('/hr_attendance/get_current_data', type='json', auth='user')
    def get_current_data(self):
        """
        Retrieve the current attendance data for the logged-in user.

        :return:    A dictionary containing the current project, task, and description.
        :rtype:     dict
        """
        employee = request.env.user.employee_id
        last_attendance_id = employee.last_attendance_id

        current_data = {
            'project': False,
            'task': False,
            'description': False,
        }
        if last_attendance_id and not last_attendance_id.check_out:
            project_id = last_attendance_id.project_id
            task_id = last_attendance_id.task_id
            description = last_attendance_id.description

            if project_id:
                current_data['project'] = {
                    'id': project_id.id,
                    'name': project_id.name,
                }
            if task_id:
                current_data['task'] = {
                    'id': task_id.id,
                    'name': task_id.name,
                }
            if description:
                current_data['description'] = description

        return current_data

    # -------------------------------------------------------------------------
    # OVERRIDE
    # -------------------------------------------------------------------------
    @http.route('/hr_attendance/systray_check_in_out', type="json", auth="user")
    def systray_attendance(self, project_id=None, task_id=None, description=None, latitude=False, longitude=False):
        employee = request.env.user.employee_id
        project_id = int(project_id)
        task_id = int(task_id)

        geo_ip_response = self._get_geoip_response(
            mode='systray',
            latitude=latitude,
            longitude=longitude
        )
        employee._attendance_action_change(
            project_id,
            task_id,
            description,
            geo_ip_response,
        )

        return self._get_employee_info_response(employee)
