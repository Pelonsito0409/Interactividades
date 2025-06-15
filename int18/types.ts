
import React from 'react';

export enum EnergyType {
  MECHANICAL_KINETIC = 'Cinética',
  MECHANICAL_POTENTIAL = 'Potencial',
  ELECTRICAL = 'Eléctrica',
  THERMAL = 'Térmica',
  CHEMICAL = 'Química',
  NUCLEAR = 'Nuclear',
  RADIANT = 'Radiante',
}

export interface EnergyDefinition {
  type: EnergyType;
  name: string;
  description: string;
  icon: React.ReactNode; // Can be any renderable node, including ReactElements
  color: string; // Tailwind color class e.g. bg-blue-500
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  presentEnergyTypes: EnergyType[];
  explanation: string;
}

export interface TransformationExample {
  id: string;
  title: string;
  from: EnergyType;
  to: EnergyType[];
  description: string;
  imageUrl?: string;
}

export interface QuizQuestion {
  id: string;
  questionText: string;
  options: { text: string; id: string }[];
  correctOptionId: string;
  explanation: string;
}

export type SelectedEnergyTypes = {
  [key in EnergyType]?: boolean;
};

export enum AppView {
  INTRODUCTION = 'INTRODUCTION',
  SCENARIO_EXPLORER = 'SCENARIO_EXPLORER',
  TRANSFORMATION_VISUALIZER = 'TRANSFORMATION_VISUALIZER',
  CONSERVATION_DEMO = 'CONSERVATION_DEMO',
  QUIZ = 'QUIZ',
}
