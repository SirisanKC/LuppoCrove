import { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Trees, GripVertical, X, Search, UserCircle2 } from "lucide-react";
import { DemoNav } from "../components/DemoNav";

// Project Marketplace - Canva-style Drag-and-Drop Squad Builder for Students

interface Student {
  id: string;
  name: string;
  major: string;
  avatar: string;
}

interface Slot {
  id: string;
  role: string;
  assignedStudent: Student | null;
}

const ItemType = "STUDENT";

function StudentCard({ student, isInPool }: { student: Student; isInPool: boolean }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemType,
    item: { student },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`flex items-center gap-3 h-16 bg-white rounded-lg px-4 cursor-move transition-all ${
        isDragging ? "opacity-30 scale-105 shadow-[0_16px_32px_rgba(0,0,0,0.15)] rotate-2" : "shadow-sm hover:shadow-md"
      }`}
    >
      {isInPool && <GripVertical className="w-4 h-4 text-gray-400" />}
      <div className="w-10 h-10 rounded-full bg-[#2d5a47]/10 flex items-center justify-center text-[#2d5a47] font-semibold text-sm">
        {student.avatar}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{student.name}</p>
        <p className="text-xs text-gray-600 truncate">{student.major}</p>
      </div>
    </div>
  );
}

function SlotComponent({
  slot,
  onDrop,
  onRemove,
}: {
  slot: Slot;
  onDrop: (studentId: string, slotId: string) => void;
  onRemove: (slotId: string) => void;
}) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemType,
    drop: (item: { student: Student }) => onDrop(item.student.id, slot.id),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`relative rounded-xl p-5 transition-all min-h-[140px] {
        slot.assignedStudent
          ? "bg-white border-2 border-gray-200 shadow-sm"
          : isOver
          ? "bg-[#2d5a47]/10 border-2 border-[#2d5a47] border-dashed"
          : "bg-[#f0f0ed] border-2 border-dashed border-gray-300"
      }`}
    >
      {slot.assignedStudent ? (
        <>
          <button
            onClick={() => onRemove(slot.id)}
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all"
          >
            <X className="w-3 h-3 text-gray-600" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#2d5a47]/10 flex items-center justify-center text-[#2d5a47] font-semibold text-sm">
              {slot.assignedStudent.avatar}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">{slot.assignedStudent.name}</p>
              <p className="text-xs text-gray-600">{slot.assignedStudent.major}</p>
              <p className="text-xs text-[#2d5a47] font-semibold mt-1">{slot.role}</p>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <UserCircle2 className="w-12 h-12 text-gray-300 mb-3" strokeWidth={1.5} />
          <p className="text-sm font-semibold text-gray-900 mb-1">Role: {slot.role}</p>
          <p className="text-xs text-gray-500">Drag team member here</p>
        </div>
      )}
    </div>
  );
}

function ProjectMarketplaceContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [slots, setSlots] = useState<Slot[]>([
    { id: "1", role: "Data Engineer", assignedStudent: null },
    { id: "2", role: "Data Analyst", assignedStudent: null },
    { id: "3", role: "Backend Developer", assignedStudent: null },
    { id: "4", role: "Project Manager", assignedStudent: null },
  ]);

  const allStudents: Student[] = [
    { id: "1", name: "Sara Korhonen", major: "Data Analytics", avatar: "SK" },
    { id: "2", name: "Mikko Virtanen", major: "Software Engineering", avatar: "MV" },
    { id: "3", name: "Emma Lahtinen", major: "Data Science", avatar: "EL" },
    { id: "4", name: "Jani Mäkinen", major: "Computer Science", avatar: "JM" },
    { id: "5", name: "Liisa Nieminen", major: "AI & Machine Learning", avatar: "LN" },
    { id: "6", name: "Petri Heikkinen", major: "Information Systems", avatar: "PH" },
  ];

  const assignedStudentIds = slots
    .filter((slot) => slot.assignedStudent)
    .map((slot) => slot.assignedStudent!.id);

  const availableStudents = allStudents.filter(
    (student) =>
      !assignedStudentIds.includes(student.id) &&
      (searchQuery === "" ||
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.major.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleDrop = (studentId: string, slotId: string) => {
    const student = allStudents.find((s) => s.id === studentId);
    if (!student) return;

    setSlots((prev) =>
      prev.map((slot) => {
        // Remove student from any existing slot
        if (slot.assignedStudent?.id === studentId) {
          return { ...slot, assignedStudent: null };
        }
        // Add student to the target slot
        if (slot.id === slotId) {
          return { ...slot, assignedStudent: student };
        }
        return slot;
      })
    );
  };

  const handleRemove = (slotId: string) => {
    setSlots((prev) =>
      prev.map((slot) => (slot.id === slotId ? { ...slot, assignedStudent: null } : slot))
    );
  };

  const isTeamComplete = slots.every((slot) => slot.assignedStudent !== null);

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      {/* Header Section - Project Context */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-2 mb-4">
            <Trees className="w-6 h-6 text-[#2d5a47]" strokeWidth={1.5} />
            <span className="text-lg font-medium text-gray-900">LuppoGrove</span>
          </div>
          <h1 className="text-[28px] font-bold text-gray-900 mb-2">
            Predictive Maintenance Algorithm
          </h1>
          <p className="text-sm text-gray-600">
            Sponsored by Konecranes • Teacher: Jonas H.
          </p>
          <p className="text-sm text-gray-700 mt-3 max-w-3xl leading-relaxed">
            Build a machine learning model to predict equipment failures using real telemetry data.
            Work with industrial-grade datasets and deploy a production-ready solution.
          </p>
        </div>
      </header>

      {/* Main Drag-and-Drop Workspace */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-[30%_70%] gap-6">
          {/* Left Sidebar - Available Student Pool */}
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Peers</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search students..."
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a47] focus:border-transparent"
                />
              </div>
            </div>

            <div className="space-y-3">
              {availableStudents.map((student) => (
                <StudentCard key={student.id} student={student} isInPool={true} />
              ))}
              {availableStudents.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-8">
                  {searchQuery ? "No students match your search." : "All students assigned!"}
                </p>
              )}
            </div>
          </div>

          {/* Right Canvas - The Squad Builder */}
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Build Your Squad</h2>
              <p className="text-sm text-gray-600">
                Drag and drop students into the team roles below
              </p>
            </div>

            {/* Team Roster Container */}
            <div className="bg-[#f0f0ed] rounded-2xl border-2 border-dashed border-gray-300 p-8">
              <div className="grid grid-cols-2 gap-6">
                {slots.map((slot) => (
                  <SlotComponent
                    key={slot.id}
                    slot={slot}
                    onDrop={handleDrop}
                    onRemove={handleRemove}
                  />
                ))}
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex justify-end gap-4">
                <button className="px-6 py-3 text-gray-700 hover:bg-gray-200 rounded-xl transition-all font-medium">
                  Save Draft
                </button>
                <button
                  disabled={!isTeamComplete}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                    isTeamComplete
                      ? "bg-[#2d5a47] text-white hover:bg-[#234739] hover:scale-[1.02] shadow-sm hover:shadow-md"
                      : "bg-[#2d5a47]/30 text-white/60 cursor-not-allowed"
                  }`}
                >
                  Submit Team Application
                </button>
              </div>

              {!isTeamComplete && (
                <p className="text-xs text-gray-500 text-right mt-2">
                  Fill all roles to submit your team
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProjectMarketplace() {
  return (
    <DndProvider backend={HTML5Backend}>
      <DemoNav />
      <ProjectMarketplaceContent />
    </DndProvider>
  );
}