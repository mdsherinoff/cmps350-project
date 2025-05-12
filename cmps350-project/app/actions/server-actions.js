"use server";

import MasterRepo from "../repo/master-repo";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

//User
export async function findUserByUsernameAction(username) {
  return await MasterRepo.findUserByUsername(username);
}

export async function findStudentProfileByUIdAction(studentUId) {
  return await MasterRepo.findStudentProfileByUId(studentUId);
}

export async function findInstructorProfileByUIdAction(instructorUId) {
  return await MasterRepo.findInstructorProfileByUId(instructorUId);
}

export async function getAllStudentsAction() {
  return await MasterRepo.getAllStudents();
}

export async function findCourseByUIdAction() {
  return await MasterRepo.findCourseByUId();
}

export async function findCourseByCodeAction() {
  return await MasterRepo.findCourseByCode();
}

export async function getEnrollmentsForStudentAction() {
  return await MasterRepo.getEnrollmentsForStudent();
}

export async function getStudentsEnrolledInSectionAction() {
  return await MasterRepo.getStudentsEnrolledInSection();
}

export async function createCourseAction(courseData) {
  return await MasterRepo.addMeal(courseData);
}

export async function updateStudentGradeAction(courseData) {
  return await MasterRepo.updateStudentGrade(courseData);
}

export async function registerStudentInCourseAction(courseData) {
  return await MasterRepo.registerStudentInCourse(courseData);
}


export async function getInstructorAnalyticsAction() {
  return await MasterRepo.getInstructorAnalytics();
}

export async function getCourseAnalyticsAction() {
  return await MasterRepo.getCourseAnalytics();
}

export async function getStudentAnalyticsAction(courseData) {
  return await MasterRepo.getStudentAnalytics(courseData);
}
