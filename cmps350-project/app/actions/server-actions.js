'use server'

import masterRepo from "../repo/master-repo"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"


//User
export async function findUserByUsernameAction(username) {
    return await masterRepo.findUserByUsername(username)
}

export async function findStudentProfileByUIdAction(studentUId) {
    return await masterRepo.findStudentProfileByUId(studentUId)
}

export async function findInstructorProfileByUIdAction(instructorUId) {
    return await masterRepo.findInstructorProfileByUId(instructorUId)
}

export async function getAllStudentsAction() {
    return masterRepo.getAllStudents()
}

export async function findCourseByUIdAction() {
    return masterRepo.findCourseByUId()
}

export async function findCourseByCodeAction() {
    return masterRepo.findCourseByCode()
}

export async function getEnrollmentsForStudentAction() {
    return masterRepo.getEnrollmentsForStudent()
}

export async function getStudentsEnrolledInSectionAction() {
    return masterRepo.getStudentsEnrolledInSection()
}

export async function getStudentsEnrolledInSectionAction() {
    return masterRepo.getStudentsEnrolledInSection()
}

export async function createCourseAction(courseData){
    return await mealsRepo.addMeal(courseData);
}

export async function updateStudentGradeAction(courseData){
    return await mealsRepo.updateStudentGrade(courseData);
}

export async function registerStudentInCourseAction(courseData){
    return await mealsRepo.registerStudentInCourse(courseData);
}
export async function updateStudentGradeAction(courseData){
    return await mealsRepo.updateStudentGrade(courseData);
}




